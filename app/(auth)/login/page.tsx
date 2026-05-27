import { LoginHeroPanel } from "@/components/auth/LoginHeroPanel";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-[60%_40%]">
      <LoginHeroPanel />
      <div
        className="flex flex-col justify-center"
        style={{ background: "hsl(var(--card))" }}
      >
        <LoginForm />
      </div>
    </div>
  );
}
