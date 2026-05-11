import { useMutation } from "@tanstack/react-query";
import { CreditCard, Download, FileText, Sparkles, Upload } from "lucide-react";
import { useMemo, useState } from "react";
import { uploadDocument, type UploadedFile } from "../../api/uploads";
import type { User } from "../../types/api";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";

type PaidCvGeneratorPanelProps = {
  candidate: User;
};

type PaymentMethod = "mpesa" | "paypal";

function buildProfessionalCv(candidate: User, uploadedCv: UploadedFile, paymentMethod: PaymentMethod) {
  const date = new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
  }).format(new Date());

  return [
    `${candidate.name.toUpperCase()}`,
    "Professional Candidate Profile",
    "",
    "CONTACT",
    `Email: ${candidate.email}`,
    `Phone: ${candidate.phone ?? "Available on request"}`,
    `National ID / Passport: ${candidate.nationalIdOrPassport ?? "Available on request"}`,
    "",
    "PROFESSIONAL SUMMARY",
    `${candidate.name} is a registered Mutawai HR Consultants Limited candidate with a verified application profile. This professional CV draft is structured from the uploaded generic CV and candidate account details, ready for review and final polishing by the recruitment team.`,
    "",
    "CORE STRENGTHS",
    "- Reliable workplace conduct and availability for structured placement review.",
    "- Documented candidate profile with identity and contact information captured.",
    "- Ready for role-specific screening, shortlist review, and employer submission.",
    "- Professional communication and compliance with recruitment documentation requirements.",
    "",
    "TARGET ROLES",
    "Service, hospitality, logistics, healthcare support, domestic support, cleaning, security, cashier, warehouse, and general operations roles.",
    "",
    "DOCUMENT SOURCE",
    `Generic CV uploaded: ${uploadedCv.originalName}`,
    `Generated service payment method: ${paymentMethod === "mpesa" ? "M-Pesa" : "PayPal"}`,
    `Generated on: ${date}`,
    "",
    "RECRUITMENT STATUS",
    `Candidate status: ${candidate.candidateStatus ?? "processing"}`,
    candidate.adminComment ? `Admin note: ${candidate.adminComment}` : "Admin note: Pending review.",
    "",
    "NEXT STEP",
    "Mutawai HR Consultants Limited should review this generated draft against the uploaded CV, add work history, education, certifications, and role-specific achievements, then export the final CV for submission.",
  ].join("\n");
}

export function PaidCvGeneratorPanel({ candidate }: PaidCvGeneratorPanelProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mpesa");
  const [paymentReference, setPaymentReference] = useState("");
  const [genericCv, setGenericCv] = useState<UploadedFile | null>(null);
  const [generatedCv, setGeneratedCv] = useState("");
  const [error, setError] = useState("");
  const uploadMutation = useMutation({ mutationFn: uploadDocument });
  const canGenerate = Boolean(genericCv && paymentReference.trim().length >= 4);
  const generatedFileName = useMemo(
    () => `${candidate.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-professional-cv.txt`,
    [candidate.name],
  );

  async function handleGenericCvUpload(files: FileList | null) {
    const file = files?.[0];
    if (!file) {
      return;
    }

    setError("");
    setGeneratedCv("");
    const uploaded = await uploadMutation.mutateAsync(file);
    setGenericCv(uploaded);
  }

  function handleGenerate() {
    if (!genericCv) {
      setError("Upload your generic CV before requesting the professional CV service.");
      return;
    }

    if (paymentReference.trim().length < 4) {
      setError("Enter the M-Pesa code or PayPal transaction ID before generating the CV.");
      return;
    }

    setError("");
    setGeneratedCv(buildProfessionalCv(candidate, genericCv, paymentMethod));
  }

  function handleDownload() {
    if (!generatedCv) {
      return;
    }

    const blob = new Blob([generatedCv], { type: "text/plain;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = generatedFileName;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  return (
    <Card className="overflow-hidden p-0">
      <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
        <div className="bg-ink p-6 text-white">
          <div className="flex size-12 items-center justify-center rounded-md bg-brass text-ink">
            <Sparkles size={26} />
          </div>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-brass">
            Paid CV Service
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold">
            Generate a professional CV from your uploaded generic CV.
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/75">
            Upload your current CV, enter your M-Pesa or PayPal transaction reference, then generate
            a structured professional draft inside your candidate account.
          </p>
        </div>

        <div className="grid gap-5 p-6">
          <div>
            <label className="text-sm font-bold text-ink">Upload generic CV</label>
            <Input
              type="file"
              accept=".pdf,.doc,.docx,image/png,image/jpeg,image/webp"
              onChange={(event) => void handleGenericCvUpload(event.target.files)}
            />
            {genericCv && (
              <p className="mt-1 text-xs font-semibold text-teal">
                Uploaded: {genericCv.originalName}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-bold text-ink">Payment method</label>
            <div className="mt-2 grid grid-cols-2 gap-2 rounded-md bg-mist p-1">
              {(["mpesa", "paypal"] as PaymentMethod[]).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`h-10 rounded-md text-sm font-bold transition ${
                    paymentMethod === method ? "bg-white text-ink shadow-sm" : "text-graphite"
                  }`}
                >
                  {method === "mpesa" ? "M-Pesa" : "PayPal"}
                </button>
              ))}
            </div>
          </div>

          <Input
            placeholder="M-Pesa code or PayPal transaction ID"
            value={paymentReference}
            onChange={(event) => setPaymentReference(event.target.value)}
          />

          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              disabled={uploadMutation.isPending || !canGenerate}
              onClick={handleGenerate}
            >
              <CreditCard size={18} />
              {uploadMutation.isPending ? "Uploading..." : "Generate Paid CV"}
            </Button>
            {generatedCv && (
              <Button type="button" variant="secondary" onClick={handleDownload}>
                <Download size={18} />
                Download CV
              </Button>
            )}
          </div>

          {(error || uploadMutation.isError) && (
            <p className="text-sm font-semibold text-coral">
              {error || "CV upload failed. Try again with a PDF, DOCX, DOC, or image file."}
            </p>
          )}

          {generatedCv && (
            <div className="max-h-72 overflow-auto rounded-md border border-ink/10 bg-porcelain p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-bold text-ink">
                <FileText size={18} />
                Professional CV Draft
              </div>
              <pre className="whitespace-pre-wrap text-xs leading-6 text-graphite">
                {generatedCv}
              </pre>
            </div>
          )}

          {!generatedCv && (
            <div className="rounded-md border border-dashed border-ink/20 p-4 text-sm leading-6 text-graphite">
              <Upload className="mb-2 text-teal" size={20} />
              Payment reference and CV upload are required before the professional CV draft is
              generated.
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
