"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { AuthContextType, AuthUser } from "@/types/auth";
import { api } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";

const TOKEN_KEY = "oficina_token";

function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

function setStoredToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
  document.cookie = `oficina_auth=${token}; path=/; SameSite=Strict; max-age=604800`;
}

function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
  document.cookie = "oficina_auth=; path=/; SameSite=Strict; max-age=0";
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setIsReady(true);
      return;
    }

    api
      .get<AuthUser>(API_ENDPOINTS.auth.me, { token })
      .then((userData) => setUser(userData))
      .catch(() => clearStoredToken())
      .finally(() => setIsReady(true));
  }, []);

  const signIn = useCallback(async (email: string, senha: string): Promise<AuthUser> => {
    const { token, usuario } = await api.post<{ token: string; usuario: AuthUser }>(
      API_ENDPOINTS.auth.login,
      { email, senha }
    );

    setStoredToken(token);
    setUser(usuario);
    return usuario;
  }, []);

  const signOut = useCallback(() => {
    clearStoredToken();
    setUser(null);
  }, []);

  const getToken = useCallback(() => getStoredToken(), []);

  if (!isReady) return null;

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
