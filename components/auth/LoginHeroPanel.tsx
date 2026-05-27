import Image from "next/image";
import { Wrench, Shield, BarChart3, Users } from "lucide-react";

const features = [
  { icon: Wrench, label: "Gestão completa de ordens de serviço" },
  { icon: Shield, label: "Controle de estoque em tempo real" },
  { icon: BarChart3, label: "Relatórios gerenciais detalhados" },
  { icon: Users, label: "Cadastro de clientes e veículos" },
];

export function LoginHeroPanel() {
  return (
    <div className="relative hidden lg:flex lg:flex-col lg:justify-between overflow-hidden p-12"
      style={{
        background: "linear-gradient(145deg, oklch(0.08 0.025 255) 0%, oklch(0.14 0.06 260) 50%, oklch(0.10 0.04 265) 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 20% 50%, oklch(0.60 0.22 265 / 0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, oklch(0.52 0.18 245 / 0.10) 0%, transparent 50%)",
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 40px, oklch(0.60 0.22 265) 40px, oklch(0.60 0.22 265) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, oklch(0.60 0.22 265) 40px, oklch(0.60 0.22 265) 41px)",
        }}
      />

      <div className="relative z-10 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden ring-1 ring-white/10">
          <Image src="/logo.png" alt="Oficina Pro" width={40} height={40} className="object-cover" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-white">Oficina Pro</span>
          <span className="text-xs" style={{ color: "oklch(0.55 0.04 255)" }}>
            Sistema de Gestão
          </span>
        </div>
      </div>

      <div className="relative z-10 flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-bold leading-tight text-white tracking-tight">
            Bem-vindo
            <br />
            de volta
          </h1>
          <p style={{ color: "oklch(0.65 0.04 255)" }} className="text-base leading-relaxed max-w-xs">
            Gerencie sua oficina com eficiência. Clientes, veículos, ordens de
            serviço e muito mais em um só lugar.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {features.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3">
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                style={{ background: "oklch(0.60 0.22 265 / 0.15)" }}
              >
                <Icon className="h-4 w-4" style={{ color: "oklch(0.72 0.20 265)" }} />
              </div>
              <span className="text-sm" style={{ color: "oklch(0.72 0.04 255)" }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10">
        <p className="text-xs" style={{ color: "oklch(0.45 0.03 255)" }}>
          © 2026 Oficina Pro. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
