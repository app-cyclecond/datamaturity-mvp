"use client";

import SessionTimeout from "./SessionTimeout";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

/**
 * Wrapper para todas as páginas autenticadas.
 * Inclui o SessionTimeout globalmente sem precisar adicionar em cada página.
 */
export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  return (
    <>
      <SessionTimeout />
      {children}
    </>
  );
}
