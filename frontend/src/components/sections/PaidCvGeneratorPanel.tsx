import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreditCard, Download, FileText, RefreshCw, Sparkles, Upload } from "lucide-react";
import { useMemo, useState } from "react";
import {
  capturePaypalCvOrder,
  createPaypalCvOrder,
  generatePaidCv,
  getCvServiceStatus,
  initiateMpesaCvPayment,
  type CvPayment,
} from "../../api/cv-service";
import type { User } from "../../types/api";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";

type PaidCvGeneratorPanelProps = {
  candidate: User;
};

type PaymentMethod = "mpesa" | "paypal";
type CvFormat = "format-1" | "format-2";

const formats: Array<{
  id: CvFormat;
  title: string;
  body: string;
  sampleUrl: string;
}> = [
  {
    id: "format-1",
    title: "Format 1",
    body: "Kitchen helper style CV structure based on the Eric Munene Mithika sample.",
    sampleUrl: "/cv-templates/format-1-kitchen-helper-sample.pdf",
  },
  {
    id: "format-2",
    title: "Format 2",
    body: "Professional CV structure based on the Stella Kwamboka Jackson sample.",
    sampleUrl: "/cv-templates/format-2-stella-sample.pdf",
  },
];

export function PaidCvGeneratorPanel({ candidate }: PaidCvGeneratorPanelProps) {
  const queryClient = useQueryClient();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mpesa");
  const [mpesaPhone, setMpesaPhone] = useState(candidate.phone ?? "");
  const [paypalOrderId, setPaypalOrderId] = useState("");
  const [formatId, setFormatId] = useState<CvFormat>("format-1");
  const [genericCv, setGenericCv] = useState<File | null>(null);
  const [generatedCv, setGeneratedCv] = useState("");
  const [error, setError] = useState("");
  const statusQuery = useQuery({
    queryKey: ["cv-service-status"],
    queryFn: getCvServiceStatus,
    retry: false,
  });
  const mpesaMutation = useMutation({
    mutationFn: initiateMpesaCvPayment,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["cv-service-status"] });
    },
  });
  const paypalCreateMutation = useMutation({
    mutationFn: createPaypalCvOrder,
    onSuccess: (result) => {
      setPaypalOrderId(result.orderId);
      if (result.approveUrl) {
        window.open(result.approveUrl, "_blank", "noopener,noreferrer");
      }
      void queryClient.invalidateQueries({ queryKey: ["cv-service-status"] });
    },
  });
  const paypalCaptureMutation = useMutation({
    mutationFn: capturePaypalCvOrder,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["cv-service-status"] });
    },
  });
  const generateMutation = useMutation({
    mutationFn: generatePaidCv,
    onSuccess: (result) => {
      setGeneratedCv(result.generation.generatedCv);
      void queryClient.invalidateQueries({ queryKey: ["cv-service-status"] });
    },
  });
  const activePayment = statusQuery.data?.activePayment ?? null;
  const canGenerate = Boolean(genericCv && activePayment?.remainingGenerations);
  const generatedFileName = useMemo(
    () => `${candidate.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${formatId}.txt`,
    [candidate.name, formatId],
  );

  function handleGenericCvUpload(files: FileList | null) {
    setError("");
    setGeneratedCv("");
    setGenericCv(files?.[0] ?? null);
  }

  function handleGenerate() {
    if (!genericCv) {
      setError("Upload your generic CV before requesting the professional CV service.");
      return;
    }

    if (!activePayment) {
      setError("Complete payment first. Each verified payment gives 3 CV generation chances.");
      return;
    }

    setError("");
    generateMutation.mutate({
      paymentId: activePayment.id,
      formatId,
      file: genericCv,
    });
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
            Pay through M-Pesa Daraja or PayPal first. Each verified payment unlocks 3 CV generation
            chances across the two formats.
          </p>
          <div className="mt-6 rounded-md bg-white/10 p-4 text-sm">
            <p className="font-bold">Available chances</p>
            <p className="mt-1 text-white/75">
              {activePayment
                ? `${activePayment.remainingGenerations} of ${activePayment.generationLimit} remaining`
                : "No active paid CV credits"}
            </p>
          </div>
        </div>

        <div className="grid gap-5 p-6">
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

          {paymentMethod === "mpesa" ? (
            <div className="grid gap-3">
              <Input
                placeholder="M-Pesa phone number e.g. 0712345678"
                value={mpesaPhone}
                onChange={(event) => setMpesaPhone(event.target.value)}
              />
              <Button
                type="button"
                disabled={mpesaMutation.isPending || activePayment?.remainingGenerations === 3}
                onClick={() => mpesaMutation.mutate({ phone: mpesaPhone })}
              >
                <CreditCard size={18} />
                {mpesaMutation.isPending ? "Sending prompt..." : "Send M-Pesa Prompt"}
              </Button>
              {mpesaMutation.data && (
                <p className="text-sm font-semibold text-teal">{mpesaMutation.data.message}</p>
              )}
            </div>
          ) : (
            <div className="grid gap-3">
              <Button
                type="button"
                disabled={paypalCreateMutation.isPending || activePayment?.remainingGenerations === 3}
                onClick={() => paypalCreateMutation.mutate()}
              >
                <CreditCard size={18} />
                {paypalCreateMutation.isPending ? "Opening PayPal..." : "Open PayPal Checkout"}
              </Button>
              <div className="grid gap-2 md:grid-cols-[1fr_auto]">
                <Input
                  placeholder="PayPal order ID"
                  value={paypalOrderId}
                  onChange={(event) => setPaypalOrderId(event.target.value)}
                />
                <Button
                  type="button"
                  variant="secondary"
                  disabled={paypalCaptureMutation.isPending || !paypalOrderId}
                  onClick={() => paypalCaptureMutation.mutate(paypalOrderId)}
                >
                  Capture
                </Button>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="secondary"
              disabled={statusQuery.isFetching}
              onClick={() => void statusQuery.refetch()}
            >
              <RefreshCw size={18} />
              Refresh Payment Status
            </Button>
            {activePayment && (
              <span className="text-sm font-bold text-teal">
                Paid: {activePayment.remainingGenerations} CV chance(s) available
              </span>
            )}
          </div>

          <div>
            <label className="text-sm font-bold text-ink">Choose CV format</label>
            <div className="mt-2 grid gap-3 md:grid-cols-2">
              {formats.map((format) => (
                <button
                  key={format.id}
                  type="button"
                  onClick={() => setFormatId(format.id)}
                  className={`rounded-md border p-4 text-left transition ${
                    formatId === format.id
                      ? "border-teal bg-teal/10 text-ink"
                      : "border-ink/10 bg-white hover:border-teal"
                  }`}
                >
                  <span className="font-display text-lg font-extrabold">{format.title}</span>
                  <span className="mt-2 block text-sm leading-6 text-graphite">{format.body}</span>
                  <a
                    className="mt-3 inline-flex text-sm font-bold text-teal"
                    href={format.sampleUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(event) => event.stopPropagation()}
                  >
                    View sample
                  </a>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-ink">Upload generic CV</label>
            <Input
              type="file"
              accept=".pdf,.doc,.docx,image/png,image/jpeg,image/webp,text/plain"
              disabled={!activePayment}
              onChange={(event) => handleGenericCvUpload(event.target.files)}
            />
            {genericCv && (
              <p className="mt-1 text-xs font-semibold text-teal">Selected: {genericCv.name}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              disabled={generateMutation.isPending || !canGenerate}
              onClick={handleGenerate}
            >
              <CreditCard size={18} />
              {generateMutation.isPending ? "Generating..." : "Generate CV"}
            </Button>
            {generatedCv && (
              <Button type="button" variant="secondary" onClick={handleDownload}>
                <Download size={18} />
                Download CV
              </Button>
            )}
          </div>

          {(error ||
            statusQuery.isError ||
            mpesaMutation.isError ||
            paypalCreateMutation.isError ||
            paypalCaptureMutation.isError ||
            generateMutation.isError) && (
            <p className="text-sm font-semibold text-coral">
              {error ||
                "Payment or CV generation failed. Confirm payment variables are configured and try again."}
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
              The CV generator opens after verified payment. One payment allows 3 generations, so
              candidates can try both formats before another payment is required.
            </div>
          )}

          {statusQuery.data?.recentPayments.length ? (
            <div className="rounded-md bg-mist p-4">
              <p className="text-sm font-bold text-ink">Recent CV payments</p>
              <div className="mt-3 grid gap-2">
                {statusQuery.data.recentPayments.map((payment: CvPayment) => (
                  <div key={payment.id} className="flex justify-between gap-3 text-xs text-graphite">
                    <span>
                      {payment.method.toUpperCase()} - {payment.status}
                    </span>
                    <span>
                      {payment.remainingGenerations}/{payment.generationLimit} left
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
