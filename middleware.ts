import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: any[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Rotas de autenticação (ambas as versões de rota)
  const isAuthRoute =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/auth/login" ||
    pathname === "/auth/signup";

  // Rotas protegidas que exigem autenticação
  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/assessment") ||
    pathname.startsWith("/resultado") ||
    pathname.startsWith("/historico") ||
    pathname.startsWith("/diagnostico") ||
    pathname.startsWith("/roadmap") ||
    pathname.startsWith("/biblioteca") ||
    pathname.startsWith("/configuracoes");

  // Usuário não autenticado tentando acessar rota protegida → redireciona para login
  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("redirectedFrom", pathname);
    return NextResponse.redirect(url);
  }

  // Usuário autenticado tentando acessar rota de auth → redireciona para dashboard
  if (user && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/assessment/:path*",
    "/resultado/:path*",
    "/historico/:path*",
    "/diagnostico/:path*",
    "/roadmap/:path*",
    "/biblioteca/:path*",
    "/configuracoes/:path*",
    "/login",
    "/signup",
    "/auth/login",
    "/auth/signup",
  ],
};
