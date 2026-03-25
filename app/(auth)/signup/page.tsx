"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);

    const payload = {
      name: String(form.get("name") ?? "").trim(),
      company: String(form.get("company") ?? "").trim(),
      role: String(form.get("role") ?? "").trim(),
      email: String(form.get("email") ?? "").trim(),
      password: String(form.get("password") ?? ""),
    };

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Erro ao criar conta.");
      setLoading(false);
      return;
    }

    router.push("/login");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-violet-50 px-6 py-16">
      <div className="mx-auto max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Voltar para Home
        </Link>
      </div>
      <div className="mx-auto max-w-md rounded-2xl border bg-white p-8 shadow-sm">
        <div className="mb-6">
          <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            DataMaturity MVP
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight">Criar conta</h1>
          <p className="mt-2 text-sm text-slate-600">
            Preencha seus dados para acessar a plataforma.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Nome"
            required
            className="w-full rounded-lg border border-slate-300 bg-white p-3"
          />

          <input
            name="company"
            placeholder="Empresa"
            required
            className="w-full rounded-lg border border-slate-300 bg-white p-3"
          />

          <input
            name="role"
            placeholder="Cargo"
            required
            className="w-full rounded-lg border border-slate-300 bg-white p-3"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="w-full rounded-lg border border-slate-300 bg-white p-3"
          />

          <input
            name="password"
            type="password"
            placeholder="Senha"
            required
            minLength={6}
            className="w-full rounded-lg border border-slate-300 bg-white p-3"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-violet-600 p-3 font-medium text-white hover:bg-violet-700 disabled:opacity-60"
          >
            {loading ? "Criando..." : "Criar conta"}
          </button>
        </form>

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

        <p className="mt-4 text-sm text-slate-600">
          Já tem conta?{" "}
          <Link href="/login" className="font-medium text-violet-600 hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}