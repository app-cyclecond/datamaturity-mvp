"use client";
import { Sidebar } from "@/components/layout/sidebar";
import AuthenticatedLayout from "@/components/auth/AuthenticatedLayout";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";
import Link from "next/link";

const INDUSTRIES = ["Tech", "Financeiro", "Retail", "Saúde", "Manufatura", "Outro"];

type UserProfile = {
  id: string;
  name: string;
  email: string;
  company: string;
  role: string;
  industry: string;
  plan: string;
};

export default function ConfiguracoesPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    role: "",
    industry: "Tech",
  });

  useEffect(() => {
    const supabase = createClient();

    const load = async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        router.push("/login");
        return;
      }

      const { data: userData, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      if (userData) {
        setUser(userData as UserProfile);
        setFormData({
          name: userData.name || "",
          company: userData.company || "",
          role: userData.role || "",
          industry: userData.industry || "Tech",
        });
      }

      setIsLoading(false);
    };

    load();
  }, [router]);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("users")
        .update({
          name: formData.name,
          company: formData.company,
          role: formData.role,
          industry: formData.industry,
        })
        .eq("id", user?.id);

      if (error) throw error;

      setMessage({ type: "success", text: "Configurações salvas com sucesso!" });
      setUser({ ...user!, ...formData });
    } catch (error) {
      setMessage({ type: "error", text: "Erro ao salvar configurações. Tente novamente." });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthenticatedLayout>
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <Sidebar user={user || undefined} activePage="configuracoes" />

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-64 p-10">
        <div className="max-w-2xl">
          {/* HEADER */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
            <p className="text-gray-600 mt-2">Gerencie suas informações e preferências</p>
          </div>

          {/* MENSAGENS */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
                message.type === "success"
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <AlertCircle
                className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                  message.type === "success" ? "text-green-600" : "text-red-600"
                }`}
              />
              <p
                className={`text-sm ${
                  message.type === "success" ? "text-green-800" : "text-red-800"
                }`}
              >
                {message.text}
              </p>
            </div>
          )}

          {/* FORM */}
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <div className="space-y-6">
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  placeholder="Seu nome"
                />
              </div>

              {/* Empresa */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Empresa
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  placeholder="Nome da sua empresa"
                />
              </div>

              {/* Cargo */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Cargo
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  placeholder="Seu cargo"
                />
              </div>

              {/* Indústria */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Segmento/Indústria
                </label>
                <p className="text-sm text-gray-600 mb-3">
                  Selecione seu segmento para comparações mais precisas no benchmarking
                </p>
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  {INDUSTRIES.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
              </div>

              {/* Plano */}
              <div className="pt-4 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Plano Atual
                </label>
                <div className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium">
                  {user?.plan?.toUpperCase() || "N/A"}
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  Para alterar seu plano, acesse a página de{" "}
                  <Link href="/planos" className="text-indigo-600 hover:underline">
                    Planos
                  </Link>
                </p>
              </div>

              {/* Email (read-only) */}
              <div className="pt-4 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Para alterar seu email, entre em contato com o suporte
                </p>
              </div>
            </div>

            {/* BOTÕES */}
            <div className="mt-8 flex gap-4">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 bg-indigo-600 text-white hover:opacity-90 px-6 py-2"
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Salvando..." : "Salvar Alterações"}
              </Button>
              <button
                onClick={() => router.back()}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
      </AuthenticatedLayout>
  );
}
