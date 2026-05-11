import { and, desc, eq, gt, sql } from "drizzle-orm";
import { PDFParse } from "pdf-parse";
import { env } from "../../config/env.js";
import { db } from "../../db/client.js";
import { cvGenerations, cvServicePayments, users } from "../../db/schema.js";
import { AppError } from "../../utils/app-error.js";
import { serializeUser } from "../auth/auth.service.js";
import type { CvGenerateInput, MpesaInitiateInput, PaypalCaptureInput } from "./cv-service.validators.js";

const GENERATION_LIMIT = 3;
type PaypalLink = {
  href: string;
  rel: string;
};

function mpesaBaseUrl() {
  return env.MPESA_ENV === "production" ? "https://api.safaricom.co.ke" : "https://sandbox.safaricom.co.ke";
}

function paypalBaseUrl() {
  return env.PAYPAL_ENV === "production" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
}

function ensureMpesaConfig() {
  if (
    !env.MPESA_CONSUMER_KEY ||
    !env.MPESA_CONSUMER_SECRET ||
    !env.MPESA_PASSKEY ||
    !env.MPESA_CALLBACK_URL
  ) {
    throw new AppError("M-Pesa Daraja is not configured", 503);
  }
}

function ensurePaypalConfig() {
  if (!env.PAYPAL_CLIENT_ID || !env.PAYPAL_CLIENT_SECRET || !env.PAYPAL_RETURN_URL || !env.PAYPAL_CANCEL_URL) {
    throw new AppError("PayPal checkout is not configured", 503);
  }
}

function formatKenyanPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("254") && digits.length === 12) {
    return digits;
  }

  if (digits.startsWith("0") && digits.length === 10) {
    return `254${digits.slice(1)}`;
  }

  if (digits.length === 9) {
    return `254${digits}`;
  }

  throw new AppError("Enter a valid Kenyan M-Pesa phone number", 400);
}

function mpesaTimestamp() {
  const date = new Date();
  const parts = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
    String(date.getHours()).padStart(2, "0"),
    String(date.getMinutes()).padStart(2, "0"),
    String(date.getSeconds()).padStart(2, "0"),
  ];
  return parts.join("");
}

async function getMpesaAccessToken() {
  ensureMpesaConfig();
  const credentials = Buffer.from(`${env.MPESA_CONSUMER_KEY}:${env.MPESA_CONSUMER_SECRET}`).toString("base64");
  const response = await fetch(`${mpesaBaseUrl()}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: {
      Authorization: `Basic ${credentials}`,
    },
  });

  if (!response.ok) {
    throw new AppError("Unable to authenticate with M-Pesa Daraja", 502);
  }

  const data = (await response.json()) as { access_token?: string };
  if (!data.access_token) {
    throw new AppError("M-Pesa Daraja did not return an access token", 502);
  }

  return data.access_token;
}

async function getPaypalAccessToken() {
  ensurePaypalConfig();
  const credentials = Buffer.from(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_CLIENT_SECRET}`).toString("base64");
  const response = await fetch(`${paypalBaseUrl()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    throw new AppError("Unable to authenticate with PayPal", 502);
  }

  const data = (await response.json()) as { access_token?: string };
  if (!data.access_token) {
    throw new AppError("PayPal did not return an access token", 502);
  }

  return data.access_token;
}

function summarizePayment(payment: typeof cvServicePayments.$inferSelect) {
  return {
    id: payment.id,
    method: payment.method,
    status: payment.status,
    providerReference: payment.providerReference,
    checkoutRequestId: payment.checkoutRequestId,
    amount: payment.amount,
    currency: payment.currency,
    generationLimit: payment.generationLimit,
    generationCount: payment.generationCount,
    remainingGenerations: Math.max(payment.generationLimit - payment.generationCount, 0),
    createdAt: payment.createdAt,
  };
}

export async function getStatus(candidateId: number) {
  const activePayment = await db.query.cvServicePayments.findFirst({
    where: and(
      eq(cvServicePayments.candidateId, candidateId),
      eq(cvServicePayments.status, "verified"),
      gt(cvServicePayments.generationLimit, cvServicePayments.generationCount),
    ),
    orderBy: [desc(cvServicePayments.createdAt)],
  });

  const recentPayments = await db.query.cvServicePayments.findMany({
    where: eq(cvServicePayments.candidateId, candidateId),
    orderBy: [desc(cvServicePayments.createdAt)],
    limit: 5,
  });

  return {
    activePayment: activePayment ? summarizePayment(activePayment) : null,
    recentPayments: recentPayments.map(summarizePayment),
    generationLimit: GENERATION_LIMIT,
  };
}

export async function initiateMpesa(input: MpesaInitiateInput, candidateId: number) {
  ensureMpesaConfig();
  const phone = formatKenyanPhone(input.phone);
  const timestamp = mpesaTimestamp();
  const password = Buffer.from(`${env.MPESA_SHORTCODE}${env.MPESA_PASSKEY}${timestamp}`).toString("base64");
  const token = await getMpesaAccessToken();

  const response = await fetch(`${mpesaBaseUrl()}/mpesa/stkpush/v1/processrequest`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      BusinessShortCode: env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Number(env.CV_SERVICE_AMOUNT_KES),
      PartyA: phone,
      PartyB: env.MPESA_SHORTCODE,
      PhoneNumber: phone,
      CallBackURL: env.MPESA_CALLBACK_URL,
      AccountReference: env.MPESA_ACCOUNT_REFERENCE,
      TransactionDesc: "Professional CV generation",
    }),
  });

  const data = (await response.json()) as {
    ResponseCode?: string;
    CheckoutRequestID?: string;
    MerchantRequestID?: string;
    errorMessage?: string;
  };

  if (!response.ok || data.ResponseCode !== "0" || !data.CheckoutRequestID) {
    throw new AppError(data.errorMessage ?? "M-Pesa STK prompt could not be sent", 502);
  }

  const [payment] = await db
    .insert(cvServicePayments)
    .values({
      candidateId,
      method: "mpesa",
      status: "pending",
      checkoutRequestId: data.CheckoutRequestID,
      providerReference: data.MerchantRequestID,
      amount: env.CV_SERVICE_AMOUNT_KES,
      currency: "KES",
      generationLimit: GENERATION_LIMIT,
      generationCount: 0,
    })
    .returning();

  return {
    payment: summarizePayment(payment),
    checkoutRequestId: data.CheckoutRequestID,
    message: "M-Pesa prompt sent. Enter your PIN on the phone, then refresh payment status.",
  };
}

export async function handleMpesaCallback(body: unknown) {
  const callback = body as {
    Body?: {
      stkCallback?: {
        CheckoutRequestID?: string;
        ResultCode?: number;
        ResultDesc?: string;
        CallbackMetadata?: {
          Item?: Array<{ Name?: string; Value?: string | number }>;
        };
      };
    };
  };
  const stk = callback.Body?.stkCallback;
  const checkoutRequestId = stk?.CheckoutRequestID;

  if (!checkoutRequestId) {
    return;
  }

  const receipt = stk.CallbackMetadata?.Item?.find((item) => item.Name === "MpesaReceiptNumber")?.Value;
  await db
    .update(cvServicePayments)
    .set({
      status: stk.ResultCode === 0 ? "verified" : "rejected",
      providerReference: receipt ? String(receipt) : stk.ResultDesc,
      updatedAt: new Date(),
    })
    .where(eq(cvServicePayments.checkoutRequestId, checkoutRequestId));
}

export async function createPaypalOrder(candidateId: number) {
  ensurePaypalConfig();
  const token = await getPaypalAccessToken();
  const response = await fetch(`${paypalBaseUrl()}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          description: "Mutawai professional CV generation",
          amount: {
            currency_code: "USD",
            value: env.CV_SERVICE_AMOUNT_USD,
          },
        },
      ],
      payment_source: {
        paypal: {
          experience_context: {
            payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
            landing_page: "LOGIN",
            shipping_preference: "NO_SHIPPING",
            user_action: "PAY_NOW",
            return_url: env.PAYPAL_RETURN_URL,
            cancel_url: env.PAYPAL_CANCEL_URL,
          },
        },
      },
    }),
  });

  const data = (await response.json()) as { id?: string; links?: PaypalLink[] };
  if (!response.ok || !data.id) {
    throw new AppError("PayPal order could not be created", 502);
  }

  const approveUrl = data.links?.find((link) => link.rel === "payer-action" || link.rel === "approve")?.href;
  const [payment] = await db
    .insert(cvServicePayments)
    .values({
      candidateId,
      method: "paypal",
      status: "pending",
      providerReference: data.id,
      amount: env.CV_SERVICE_AMOUNT_USD,
      currency: "USD",
      generationLimit: GENERATION_LIMIT,
      generationCount: 0,
    })
    .returning();

  return {
    payment: summarizePayment(payment),
    orderId: data.id,
    approveUrl,
  };
}

export async function capturePaypalOrder(input: PaypalCaptureInput, candidateId: number) {
  ensurePaypalConfig();
  const token = await getPaypalAccessToken();
  const response = await fetch(`${paypalBaseUrl()}/v2/checkout/orders/${input.orderId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: "{}",
  });

  const data = (await response.json()) as { status?: string; id?: string };
  if (!response.ok || data.status !== "COMPLETED") {
    throw new AppError("PayPal payment has not been completed", 402);
  }

  const [payment] = await db
    .update(cvServicePayments)
    .set({
      status: "verified",
      updatedAt: new Date(),
    })
    .where(and(eq(cvServicePayments.providerReference, input.orderId), eq(cvServicePayments.candidateId, candidateId)))
    .returning();

  if (!payment) {
    throw new AppError("PayPal payment record was not found", 404);
  }

  return summarizePayment(payment);
}

function compactSourceText(text: string) {
  return text
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, 5500);
}

async function extractCvText(file: Express.Multer.File) {
  if (file.mimetype === "application/pdf") {
    const parser = new PDFParse({ data: file.buffer });
    try {
      const result = await parser.getText();
      return compactSourceText(result.text);
    } finally {
      await parser.destroy();
    }
  }

  if (file.mimetype === "text/plain") {
    return compactSourceText(file.buffer.toString("utf8"));
  }

  return compactSourceText(
    `Uploaded source CV file: ${file.originalname}. The file was received successfully. Use the candidate details and attached document during final review.`,
  );
}

function buildFormatOne(candidate: ReturnType<typeof serializeUser>, sourceText: string, fileName: string) {
  return [
    candidate.name.toUpperCase(),
    "KITCHEN / GENERAL SUPPORT CURRICULUM VITAE",
    "",
    "PERSONAL DETAILS",
    `Name: ${candidate.name}`,
    `Email: ${candidate.email}`,
    `Phone: ${candidate.phone ?? "Available on request"}`,
    `National ID / Passport: ${candidate.nationalIdOrPassport ?? "Available on request"}`,
    "",
    "CAREER PROFILE",
    `${candidate.name} is presented as a disciplined, reliable, and hardworking candidate ready for practical support roles. The details below are restructured from the uploaded generic CV into Format 1 for Mutawai HR review and final editing.`,
    "",
    "KEY SKILLS AND COMPETENCIES",
    "- Kitchen support, cleaning, stock organization, and general workplace assistance.",
    "- Time management, hygiene awareness, teamwork, and instruction-following.",
    "- Customer service awareness and ability to work in structured shifts.",
    "- Readiness for screening, placement review, and employer submission.",
    "",
    "RESTRUCTURED SOURCE INFORMATION",
    sourceText || "No readable text was extracted from the uploaded CV. Review the attached source CV manually.",
    "",
    "SOURCE DOCUMENT",
    fileName,
    "",
    "REFEREES",
    "Available upon request.",
  ].join("\n");
}

function buildFormatTwo(candidate: ReturnType<typeof serializeUser>, sourceText: string, fileName: string) {
  return [
    candidate.name.toUpperCase(),
    "PROFESSIONAL CURRICULUM VITAE",
    "",
    "CONTACT INFORMATION",
    `Email: ${candidate.email}`,
    `Mobile: ${candidate.phone ?? "Available on request"}`,
    `ID / Passport: ${candidate.nationalIdOrPassport ?? "Available on request"}`,
    "",
    "PROFILE SUMMARY",
    `${candidate.name} is a registered Mutawai HR Consultants Limited candidate. This CV draft transfers information from the uploaded generic CV into Format 2, with a cleaner professional profile, organized sections, and recruiter-ready presentation.`,
    "",
    "CAREER OBJECTIVE",
    "To secure a suitable position where reliability, service discipline, practical skills, and professional conduct can contribute to the employer's operations.",
    "",
    "CORE COMPETENCIES",
    "- Professional conduct and disciplined attendance.",
    "- Ability to follow procedures and communicate clearly.",
    "- Adaptability across service, care, hospitality, domestic, logistics, and support roles.",
    "- Willingness to complete screening and submit required documentation.",
    "",
    "EXPERIENCE, EDUCATION, AND SUPPORTING DETAILS FROM UPLOADED CV",
    sourceText || "No readable text was extracted from the uploaded CV. Review the attached source CV manually.",
    "",
    "DOCUMENT SOURCE",
    fileName,
    "",
    "DECLARATION",
    "I confirm that the information provided is true and complete to the best of my knowledge.",
  ].join("\n");
}

export async function generateCv(input: CvGenerateInput, candidateId: number, file: Express.Multer.File | undefined) {
  if (!file) {
    throw new AppError("Upload a generic CV before generating a professional CV", 400);
  }

  const candidate = await db.query.users.findFirst({
    where: eq(users.id, candidateId),
  });
  if (!candidate) {
    throw new AppError("Candidate not found", 404);
  }

  const payment = await db.query.cvServicePayments.findFirst({
    where: and(
      eq(cvServicePayments.id, input.paymentId),
      eq(cvServicePayments.candidateId, candidateId),
      eq(cvServicePayments.status, "verified"),
    ),
  });

  if (!payment) {
    throw new AppError("Verified CV service payment is required", 402);
  }

  if (payment.generationCount >= payment.generationLimit) {
    throw new AppError("This payment has used all 3 CV generation chances", 402);
  }

  const sourceText = await extractCvText(file);
  const serializedCandidate = serializeUser(candidate);
  const generatedCv =
    input.formatId === "format-1"
      ? buildFormatOne(serializedCandidate, sourceText, file.originalname)
      : buildFormatTwo(serializedCandidate, sourceText, file.originalname);

  const [generation] = await db
    .insert(cvGenerations)
    .values({
      paymentId: payment.id,
      candidateId,
      formatId: input.formatId,
      genericCvName: file.originalname,
      generatedCv,
    })
    .returning();

  const [updatedPayment] = await db
    .update(cvServicePayments)
    .set({
      generationCount: sql`${cvServicePayments.generationCount} + 1`,
      updatedAt: new Date(),
    })
    .where(eq(cvServicePayments.id, payment.id))
    .returning();

  return {
    generation,
    payment: summarizePayment(updatedPayment),
  };
}
