import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { loginAdmin } from "../services/adminApi";
import { isMockMode } from "../../shared/config/runtime";

interface AuthUser {
  email: string;
}

interface AdminAuthContextType {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const TOKEN_STORAGE_KEY = "admin_jwt_token";
const USER_STORAGE_KEY = "admin_jwt_user";
const MOCK_TOKEN_SIGNATURE = "mocksig";

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

function parseJwtPayload(token: string): { sub?: string; exp?: number } | null {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    const json = atob(padded);
    return JSON.parse(json) as { sub?: string; exp?: number };
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const payload = parseJwtPayload(token);
  if (!payload?.exp) return true;
  return payload.exp <= Math.floor(Date.now() / 1000);
}

function createMockToken(email: string): string {
  const now = Math.floor(Date.now() / 1000);
  const payload = { sub: email, iat: now, exp: now + 60 * 60 * 24 };
  const encodedPayload = btoa(JSON.stringify(payload))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
  return `mock.${encodedPayload}.${MOCK_TOKEN_SIGNATURE}`;
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);

    if (!storedToken || isTokenExpired(storedToken)) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
      setIsLoading(false);
      return;
    }

    setToken(storedToken);
    if (storedUser) {
      setUser(JSON.parse(storedUser) as AuthUser);
    } else {
      const payload = parseJwtPayload(storedToken);
      const email = payload?.sub;
      if (email) {
        const nextUser = { email };
        setUser(nextUser);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
      }
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    if (!email.trim() || !password.trim()) {
      throw new Error("Email and password are required");
    }

    const nextToken = isMockMode()
      ? createMockToken(email.trim())
      : (await loginAdmin(email, password)).token;

    const payload = parseJwtPayload(nextToken);

    if (!payload?.sub) {
      throw new Error("Invalid token payload");
    }

    const nextUser = { email: payload.sub };

    localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    setToken(null);
    setUser(null);
  };

  const value = useMemo<AdminAuthContextType>(
    () => ({
      token,
      user,
      isAuthenticated: !!token,
      isLoading,
      login,
      logout,
    }),
    [token, user, isLoading]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return context;
}

export const useAuth = useAdminAuth;
