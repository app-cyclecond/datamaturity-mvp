"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LogOut, Mail, MessageCircle, LifeBuoy,
  LayoutDashboard, ClipboardList, Zap, History,
  Map, BookOpen, Settings, BarChart3, CreditCard
} from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  user?: {
    name?: string;
    email?: string;
    plan?: string;
  };
  activePage?: "home" | "diagnostico" | "assessment" | "historico" | "roadmap" | "biblioteca" | "configuracoes" | "benchmarking" | "suporte" | "assinatura";
}

const PLAN_BADGE: Record<string, { label: string; color: string }> = {
  bronze: { label: "Bronze", color: "bg-amber-100 text-amber-700" },
  silver: { label: "Silver", color: "bg-gray-100 text-gray-600" },
  gold: { label: "Gold", color: "bg-yellow-100 text-yellow-700" },
};

export function Sidebar({ user, activePage }: SidebarProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      setIsLoggingOut(false);
    }
  };

  const navItems = [
    { href: "/dashboard", label: "Home", id: "home", icon: LayoutDashboard },
    { href: "/assessment", label: "Novo Diagnóstico", id: "assessment", icon: Zap },
    { href: "/diagnostico", label: "Último Diagnóstico", id: "diagnostico", icon: ClipboardList },
    { href: "/historico", label: "Histórico", id: "historico", icon: History },
    { href: "/roadmap", label: "Roadmap", id: "roadmap", icon: Map },
    { href: "/benchmarking", label: "Benchmarking", id: "benchmarking", icon: BarChart3 },
    { href: "/biblioteca", label: "Biblioteca", id: "biblioteca", icon: BookOpen },
    { href: "/assinatura", label: "Assinatura", id: "assinatura", icon: CreditCard },
    { href: "/configuracoes", label: "Configurações", id: "configuracoes", icon: Settings },
  ];

  const planInfo = user?.plan ? PLAN_BADGE[user.plan] : null;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between fixed h-screen overflow-y-auto">
      {/* TOP SECTION */}
      <div>
        {/* LOGO */}
        <div className="p-6 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold text-sm shadow-sm">
              DM
            </div>
            <span className="font-bold text-lg text-gray-900">DataMaturity</span>
          </div>
          {planInfo && (
            <span className={`mt-2 inline-flex text-xs font-semibold px-2 py-0.5 rounded-full ${planInfo.color}`}>
              Plano {planInfo.label}
            </span>
          )}
        </div>

        {/* NAVIGATION */}
        <nav className="space-y-0.5 px-3 mt-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <Link key={item.id} href={item.href}>
                <button
                  className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700 font-semibold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon className={`h-4 w-4 flex-shrink-0 ${isActive ? "text-indigo-600" : "text-gray-400"}`} />
                  {item.label}
                </button>
              </Link>
            );
          })}
        </nav>

        {/* SUPPORT SECTION */}
        <div className="mt-4 px-3">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 px-3">
            Suporte
          </div>

          {/* Link para a página de Suporte */}
          <Link href="/suporte">
            <button
              className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm ${
                activePage === "suporte"
                  ? "bg-indigo-50 text-indigo-700 font-semibold"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <LifeBuoy className={`h-4 w-4 flex-shrink-0 ${activePage === "suporte" ? "text-indigo-600" : "text-gray-400"}`} />
              Central de Suporte
            </button>
          </Link>

          <a
            href="mailto:contato@datamaturity.com.br"
            className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all text-sm"
          >
            <Mail className="h-4 w-4 text-gray-400" />
            Contato por Email
          </a>
          <button
            onClick={() => window.open("https://wa.me/5511919771377", "_blank")}
            className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all text-sm"
          >
            <MessageCircle className="h-4 w-4 text-gray-400" />
            Chat WhatsApp
          </button>
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="p-4 border-t border-gray-100">
        {/* USER INFO */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-gray-900 truncate">{user?.name || "Usuário"}</div>
            <div className="text-xs text-gray-400 truncate">{user?.email}</div>
          </div>
        </div>

        {/* LOGOUT BUTTON */}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-700 transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 hover:border-red-200"
        >
          <LogOut className="h-4 w-4" />
          {isLoggingOut ? "Saindo..." : "Sair da conta"}
        </button>
      </div>
    </aside>
  );
}
