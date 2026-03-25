"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut, MessageCircle, Mail, HelpCircle } from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  user?: {
    name?: string;
    email?: string;
  };
  activePage?: "home" | "diagnostico" | "assessment" | "historico" | "biblioteca" | "configuracoes";
}

export function Sidebar({ user, activePage }: SidebarProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      setIsLoggingOut(false);
    }
  };

  const navItems = [
    { href: "/dashboard", label: "Home", id: "home" },
    { href: "/diagnostico", label: "Diagnóstico Atual", id: "diagnostico" },
    { href: "/assessment", label: "Novo diagnóstico", id: "assessment" },
    { href: "/historico", label: "Histórico", id: "historico" },
    { href: "/biblioteca", label: "Biblioteca", id: "biblioteca" },
    { href: "/configuracoes", label: "Configurações", id: "configuracoes" },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between fixed h-screen">
      {/* TOP SECTION */}
      <div>
        {/* LOGO */}
        <div className="p-6 font-bold text-lg text-gray-900 flex items-center gap-2">
          <div className="h-8 w-8 bg-brand-primary text-white rounded flex items-center justify-center font-bold">
            DM
          </div>
          DataMaturity
        </div>

        {/* NAVIGATION */}
        <nav className="space-y-2 px-4">
          {navItems.map((item) => (
            <Link key={item.id} href={item.href}>
              <button
                className={`w-full text-left block p-3 rounded-lg transition-colors ${
                  activePage === item.id
                    ? "bg-gray-100 font-medium text-gray-900 hover:bg-gray-200"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.label}
              </button>
            </Link>
          ))}
        </nav>

        {/* SUPPORT SECTION */}
        <div className="mt-6 px-4 space-y-2">
          <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
            Suporte
          </div>
          <a
            href="mailto:support@datamaturity.com"
            className="w-full text-left block p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm"
          >
            <Mail className="h-4 w-4" />
            Email
          </a>
          <button
            onClick={() => {
              // TODO: Integrar com chat widget (Intercom, Zendesk, etc)
              window.open("https://chat.datamaturity.com", "_blank");
            }}
            className="w-full text-left block p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm"
          >
            <MessageCircle className="h-4 w-4" />
            Chat
          </button>
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="p-4 border-t border-gray-200">
        {/* USER INFO */}
        <div className="text-sm mb-4">
          <div className="font-medium text-gray-900">{user?.name || "Usuário"}</div>
          <div className="text-gray-500 text-xs truncate">{user?.email}</div>
        </div>

        {/* LOGOUT BUTTON */}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogOut className="h-4 w-4" />
          {isLoggingOut ? "Saindo..." : "Logout"}
        </button>
      </div>
    </aside>
  );
}
