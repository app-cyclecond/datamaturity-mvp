import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface SaveIndicatorProps {
  status: "idle" | "saving" | "saved" | "error";
  message?: string;
}

export function SaveIndicator({ status, message }: SaveIndicatorProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (status === "saved" || status === "error") {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  if (!visible) return null;

  return (
    <div
      className={`
        fixed bottom-6 right-6 rounded-lg px-4 py-3 flex items-center gap-2
        transition-all duration-300 shadow-lg
        ${
          status === "saved"
            ? "bg-green-50 border border-green-200 text-green-900"
            : "bg-red-50 border border-red-200 text-red-900"
        }
      `}
    >
      {status === "saved" ? (
        <>
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-medium">{message || "Salvo com sucesso"}</span>
        </>
      ) : (
        <>
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm font-medium">{message || "Erro ao salvar"}</span>
        </>
      )}
    </div>
  );
}
