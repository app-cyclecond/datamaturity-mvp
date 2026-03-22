"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { magicLinkAction, signInAction, signUpAction } from "@/lib/auth";
import Link from "next/link";

type AuthVariant = "login" | "signup";

type ActionState = { error?: string; success?: string };

const initialState: ActionState = {};

function SubmitButton({ text }: { text: string }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Processando..." : text}
    </Button>
  );
}

function MagicLinkForm() {
  const [state, formAction] = useFormState(magicLinkAction, initialState);

  return (
    <form action={formAction} className="space-y-4 rounded-xl border border-dashed p-4">
      <div className="space-y-2">
        <Label htmlFor="magic-email">Entrar com magic link</Label>
        <Input id="magic-email" name="email" type="email" placeholder="voce@empresa.com" required />
      </div>
      <SubmitButton text="Enviar magic link" />
      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-emerald-700">{state.success}</p> : null}
    </form>
  );
}

export function AuthForm({ variant }: { variant: AuthVariant }) {
  const action = variant === "login" ? signInAction : signUpAction;
  const [state, formAction] = useFormState(action, initialState);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{variant === "login" ? "Entrar no DataMaturity" : "Criar sua conta"}</CardTitle>
        <CardDescription>
          {variant === "login"
            ? "Acesse seu dashboard para continuar a configuração do MVP."
            : "Começamos pelo núcleo do produto: conta, login e preparação do dashboard."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form action={formAction} className="space-y-4">
          {variant === "signup" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" name="name" placeholder="Seu nome" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Empresa</Label>
                <Input id="company" name="company" placeholder="Sua empresa" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Cargo</Label>
                <Input id="role" name="role" placeholder="Head of Data, Gerente etc." required />
              </div>
            </>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="voce@empresa.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" name="password" type="password" placeholder="Mínimo de 6 caracteres" required />
          </div>
          <SubmitButton text={variant === "login" ? "Entrar" : "Criar conta"} />
          {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
          {state.success ? <p className="text-sm text-emerald-700">{state.success}</p> : null}
        </form>

        <MagicLinkForm />

        <p className="text-sm text-muted-foreground">
          {variant === "login" ? "Ainda não tem conta?" : "Já tem conta?"}{" "}
          <Link className="font-medium text-primary underline-offset-4 hover:underline" href={variant === "login" ? "/signup" : "/login"}>
            {variant === "login" ? "Criar agora" : "Entrar"}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
