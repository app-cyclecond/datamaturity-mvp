"use client";
import { Sidebar } from "@/components/layout/sidebar";
import AuthenticatedLayout from "@/components/auth/AuthenticatedLayout";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { CreditCard, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

type UserProfile = {
  id: string;
  name: string;
  email: string;
  plan: string;
};

type Subscription = {
  status: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
};

export default function AssinaturaPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCanceling, setIsCanceling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    const supabase = createClient();
    const load = async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        router.push("/login");
        return;
      }
      
      const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("id", authData.user.id)
        .single();
        
      if (userData) {
        setUser(userData as UserProfile);
      }

      const { data: subData } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", authData.user.id)
        .single();
        
      if (subData) {
        setSubscription(subData as Subscription);
      }
      
      setIsLoading(false);
    };
    load();
  }, [router]);

  const handleCancel = async () => {
    if (!cancelReason) return;
    setIsCanceling(true);
    try {
      const response = await fetch("/api/stripe/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: cancelReason }),
      });
      
      if (response.ok) {
        // Atualizar estado local
        setSubscription(prev => prev ? { ...prev, cancel_at_period_end: true } : null);
        setShowCancelModal(false);
      } else {
        alert("Erro ao cancelar assinatura. Tente novamente.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao cancelar assinatura.");
    } finally {
      setIsCanceling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  const isFree = user?.plan === "starter" || !user?.plan;
  const isCanceled = subscription?.cancel_at_period_end || subscription?.status === "cancelled";
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  return (
    <AuthenticatedLayout>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar user={user || undefined} activePage="assinatura" />
        <main className="flex-1 ml-64 p-8">
          <div className="max-w-3xl mx-auto space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Assinatura e Cobrança</h1>
              <p className="text-gray-500 mt-1">Gerencie seu plano, pagamentos e faturamento</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Seu Plano Atual</h2>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 font-semibold rounded-full text-sm uppercase tracking-wide">
                        {user?.plan || "Starter"}
                      </span>
                      {isCanceled && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                          Cancelado
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    {isFree ? (
                      <Link href="/planos">
                        <Button className="bg-indigo-600 hover:bg-indigo-700">
                          Fazer Upgrade
                        </Button>
                      </Link>
                    ) : (
                      <Link href="/planos">
                        <Button variant="outline">Mudar de Plano</Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {!isFree && subscription && (
                <div className="p-6 bg-gray-50 space-y-4">
                  <div className="flex items-start gap-3">
                    <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Ciclo de Faturamento</p>
                      <p className="text-sm text-gray-500">
                        {isCanceled 
                          ? `Seu acesso premium será mantido até ${formatDate(subscription.current_period_end)}`
                          : `Sua próxima cobrança será em ${formatDate(subscription.current_period_end)}`}
                      </p>
                    </div>
                  </div>

                  {!isCanceled && (
                    <div className="pt-4 border-t border-gray-200">
                      <button 
                        onClick={() => setShowCancelModal(true)}
                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                      >
                        Cancelar assinatura
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modal de Cancelamento */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Cancelar Assinatura</h3>
            <p className="text-gray-600 text-sm mb-6">
              Sentimos muito em ver você partir. Para nos ajudar a melhorar, por favor, conte-nos o motivo do cancelamento:
            </p>
            
            <div className="space-y-3 mb-6">
              {[
                "Muito caro para o meu orçamento",
                "Não encontrei o valor que esperava",
                "Faltam recursos importantes",
                "Difícil de usar",
                "Apenas testando",
                "Outro motivo"
              ].map((reason) => (
                <label key={reason} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input 
                    type="radio" 
                    name="cancelReason" 
                    value={reason}
                    checked={cancelReason === reason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">{reason}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowCancelModal(false)}>
                Manter Assinatura
              </Button>
              <Button 
                variant="default" 
                onClick={handleCancel}
                disabled={!cancelReason || isCanceling}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isCanceling ? "Cancelando..." : "Confirmar Cancelamento"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  );
}
