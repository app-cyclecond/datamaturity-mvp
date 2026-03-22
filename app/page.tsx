import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-violet-50">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center gap-10 px-6 py-16">
        <div className="max-w-3xl space-y-6">
          <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            Semana 1-2 · Fundação do MVP
          </span>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            DataMaturity — diagnóstico de maturidade em Dados & AI com autenticação pronta para escalar.
          </h1>
          <p className="text-lg text-slate-600">
            Esta primeira entrega cobre a base do produto: projeto Next.js 14, Tailwind, componentes estilo shadcn/ui, Supabase Auth e dashboard inicial protegido.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/signup">Criar conta</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/login">Entrar</Link>
            </Button>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            "Autenticação com email/senha e magic link",
            "Middleware protegendo o dashboard",
            "Tabelas-base prontas para assessment e relatórios"
          ].map((item) => (
            <div key={item} className="rounded-2xl border bg-white p-6 shadow-sm">
              <p className="font-medium text-slate-900">{item}</p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
