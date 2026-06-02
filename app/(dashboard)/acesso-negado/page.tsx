import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acesso Negado",
};

export default function AcessoNegadoPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-destructive"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Acesso Negado
        </h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          Você não tem permissão para acessar esta página. Entre em contato com
          o gerente da oficina caso precise de acesso.
        </p>
      </div>

      <a
        href="/dashboard"
        className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Voltar ao Dashboard
      </a>
    </div>
  );
}
