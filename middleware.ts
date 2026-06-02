import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login"];

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/clientes",
  "/veiculos",
  "/funcionarios",
  "/ordens-de-servico",
  "/pecas",
  "/pagamentos",
  "/avaliacoes",
  "/relatorios",
  "/configuracoes",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const isAuthenticated = request.cookies.get("oficina_auth")?.value === "1";

  if (!isAuthenticated) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logo.png|.*\\.svg).*)"],
};
