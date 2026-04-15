"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AlertTriangle, Clock } from "lucide-react";

// Configurações de tempo
const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutos
const WARNING_BEFORE_MS = 2 * 60 * 1000;       // aviso 2 min antes
const WARNING_DURATION_MS = 2 * 60 * 1000;     // duração do aviso = 2 min

// Eventos que indicam atividade do usuário
const ACTIVITY_EVENTS: (keyof WindowEventMap)[] = [
  "mousemove",
  "mousedown",
  "keypress",
  "touchstart",
  "scroll",
  "click",
];

export default function SessionTimeout() {
  const router = useRouter();
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(120); // segundos
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearAllTimers = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
  }, []);

  const handleLogout = useCallback(async () => {
    clearAllTimers();
    setShowWarning(false);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login?reason=timeout");
  }, [router, clearAllTimers]);

  const startCountdown = useCallback(() => {
    setCountdown(120);
    setShowWarning(true);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownRef.current) clearInterval(countdownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const resetTimer = useCallback(() => {
    clearAllTimers();
    setShowWarning(false);
    setCountdown(120);

    // Agenda aviso 28 min após última atividade
    warningRef.current = setTimeout(() => {
      startCountdown();
    }, INACTIVITY_TIMEOUT_MS - WARNING_BEFORE_MS);

    // Agenda logout 30 min após última atividade
    timeoutRef.current = setTimeout(() => {
      handleLogout();
    }, INACTIVITY_TIMEOUT_MS);
  }, [clearAllTimers, startCountdown, handleLogout]);

  // Iniciar timers e registrar eventos de atividade
  useEffect(() => {
    resetTimer();

    const handleActivity = () => {
      if (!showWarning) {
        resetTimer();
      }
    };

    ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      clearAllTimers();
      ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [resetTimer, clearAllTimers, showWarning]);

  const handleStayLoggedIn = () => {
    resetTimer();
  };

  if (!showWarning) return null;

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;
  const countdownDisplay = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border border-amber-200">
        {/* Ícone */}
        <div className="flex items-center justify-center mb-5">
          <div className="h-14 w-14 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center">
            <Clock className="h-7 w-7 text-amber-500" />
          </div>
        </div>

        {/* Título */}
        <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
          Sessão prestes a expirar
        </h2>

        {/* Descrição */}
        <p className="text-sm text-gray-500 text-center mb-6">
          Por inatividade, sua sessão será encerrada automaticamente em:
        </p>

        {/* Countdown */}
        <div className="flex items-center justify-center mb-6">
          <div className="text-5xl font-mono font-bold text-amber-500 tabular-nums">
            {countdownDisplay}
          </div>
        </div>

        {/* Aviso */}
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl p-3 mb-6">
          <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700">
            Seu progresso não será perdido. Você poderá fazer login novamente para continuar de onde parou.
          </p>
        </div>

        {/* Botões */}
        <div className="flex gap-3">
          <button
            onClick={handleLogout}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Sair agora
          </button>
          <button
            onClick={handleStayLoggedIn}
            className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Continuar conectado
          </button>
        </div>
      </div>
    </div>
  );
}
