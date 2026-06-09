export type UserRole = "GERENTE" | "ATENDENTE";

export interface AuthUser {
  id: string;
  email: string;
  perfil: UserRole;
}

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<AuthUser>;
  signOut: () => void;
  getToken: () => string | null;
}
