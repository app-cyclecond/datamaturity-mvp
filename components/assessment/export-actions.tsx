"use client";

import { useState } from "react";
import { Download, Mail, Printer, Send } from "lucide-react";
import { downloadAssessmentPDF, printAssessmentPDF } from "@/lib/pdf/generate-assessment-pdf";

interface ExportActionsProps {
  resultId: string;
  assessmentData: {
    id: string;
    overall_score: number;
    level: string;
    dimension_scores: Record<string, number>;
    created_at: string;
  };
  user?: {
    name: string;
    email: string;
    company: string;
  };
}

export function ExportActions({ resultId, assessmentData, user }: ExportActionsProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emails, setEmails] = useState<string[]>(["", "", ""]);
  const [message, setMessage] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      await downloadAssessmentPDF(assessmentData);
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      alert("Erro ao exportar PDF");
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = async () => {
    try {
      setIsPrinting(true);
      await printAssessmentPDF(assessmentData);
    } catch (error) {
      console.error("Erro ao imprimir:", error);
      alert("Erro ao imprimir");
    } finally {
      setIsPrinting(false);
    }
  };

  const handleSendEmail = async () => {
    try {
      // Validar emails
      const validEmails = emails.filter((e) => e.trim() !== "");
      if (validEmails.length === 0) {
        setEmailStatus({ type: "error", message: "Adicione pelo menos um email" });
        return;
      }

      if (validEmails.length > 3) {
        setEmailStatus({ type: "error", message: "Máximo de 3 emails permitidos" });
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      for (const email of validEmails) {
        if (!emailRegex.test(email)) {
          setEmailStatus({ type: "error", message: `Email inválido: ${email}` });
          return;
        }
      }

      setIsSendingEmail(true);
      const response = await fetch("/api/assessment/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resultId,
          emails: validEmails,
          message: message || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        setEmailStatus({ type: "error", message: error.error || "Erro ao enviar email" });
        return;
      }

      setEmailStatus({
        type: "success",
        message: `Email enviado para ${validEmails.length} destinatário(s)`,
      });
      setShowEmailForm(false);
      setEmails(["", "", ""]);
      setMessage("");

      setTimeout(() => setEmailStatus(null), 3000);
    } catch (error) {
      console.error("Erro ao enviar email:", error);
      setEmailStatus({ type: "error", message: "Erro ao enviar email" });
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* BUTTONS */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleExportPDF}
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          {isExporting ? "Exportando..." : "Exportar PDF"}
        </button>

        <button
          onClick={handlePrint}
          disabled={isPrinting}
          className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
        >
          <Printer className="h-4 w-4" />
          {isPrinting ? "Imprimindo..." : "Imprimir"}
        </button>

        <button
          onClick={() => setShowEmailForm(!showEmailForm)}
          className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg transition-colors"
        >
          <Mail className="h-4 w-4" />
          Enviar por Email
        </button>
      </div>

      {/* EMAIL FORM */}
      {showEmailForm && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Emails (máximo 3)
            </label>
            {emails.map((email, index) => (
              <input
                key={index}
                type="email"
                value={email}
                onChange={(e) => {
                  const newEmails = [...emails];
                  newEmails[index] = e.target.value;
                  setEmails(newEmails);
                }}
                placeholder={`Email ${index + 1}`}
                className="w-full mb-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Mensagem (opcional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Adicione uma mensagem personalizada..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {emailStatus && (
            <div
              className={`p-3 rounded-lg text-sm ${
                emailStatus.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {emailStatus.message}
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleSendEmail}
              disabled={isSendingEmail}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50 flex-1"
            >
              <Send className="h-4 w-4" />
              {isSendingEmail ? "Enviando..." : "Enviar"}
            </button>
            <button
              onClick={() => setShowEmailForm(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
