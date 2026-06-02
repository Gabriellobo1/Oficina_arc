"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { AuthContextType, AuthUser, UserRole } from "@/types/auth";

let _token: string | null = null;

const MOCK_USERS: Record<string, { password: string; user: AuthUser }> = {
  "admin@oficina.com": {
    password: "admin123",
    user: { id: "u1", name: "Admin Gestor", email: "admin@oficina.com", role: "admin", initials: "AG" },
  },
  "mecanico@oficina.com": {
    password: "mec123",
    user: { id: "u2", name: "João Mecânico", email: "mecanico@oficina.com", role: "mechanic", initials: "JM" },
  },
};

function resolveRole(email: string): UserRole {
  return email.includes("mecanico") ? "mechanic" : "admin";
}

function buildMockUser(email: string): AuthUser {
  const known = MOCK_USERS[email];
  if (known) return known.user;

  const role = resolveRole(email);
  const name = role === "mechanic" ? "Mecânico" : "Administrador";
  const initials = name.slice(0, 2).toUpperCase();
  return { id: "u0", name, email, role, initials };
}

function setSessionCookie() {
  document.cookie = "oficina_auth=1; path=/; SameSite=Strict; max-age=86400";
}

function clearSessionCookie() {
  document.cookie = "oficina_auth=; path=/; SameSite=Strict; max-age=0";
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const signIn = useCallback(async (email: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const known = MOCK_USERS[email];
    if (known && known.password !== password) {
      throw new Error("Credenciais inválidas.");
    }

    _token = `mock.jwt.${btoa(email)}.${Date.now()}`;
    const authUser = buildMockUser(email);
    setUser(authUser);
    setSessionCookie();
  }, []);

  const signOut = useCallback(() => {
    _token = null;
    setUser(null);
    clearSessionCookie();
  }, []);

  const getToken = useCallback(() => _token, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, signIn, signOut, getToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used inside AuthProvider");
  return ctx;
}
