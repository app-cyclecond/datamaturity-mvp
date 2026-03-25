import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { signInAction } from "@/lib/auth";

export default function LoginPage() {
  async function submitAction(formData: FormData) {
    "use server";
    await signInAction(formData);
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
          <h1 className="mt-4 text-3xl font-bold tracking-tight">Entrar</h1>
          <p className="mt-2 text-sm text-slate-600">
            Acesse sua conta.
          </p>
        </div>

        <form action={submitAction} className="space-y-4">
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
            className="w-full rounded-lg bg-violet-600 p-3 font-medium text-white hover:bg-violet-700"
          >
            Entrar
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-600">
          Não tem conta?{" "}
          <Link href="/signup" className="font-medium text-violet-600 hover:underline">
            Criar conta
          </Link>
        </p>
      </div>
    </main>
  );
}