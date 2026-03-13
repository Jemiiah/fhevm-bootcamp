"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (name: string, email: string, password: string) => Promise<boolean>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("fhevm_user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
    }
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem("fhevm_users") || "[]");
    const found = users.find((u: { email: string; password: string }) => u.email === email && u.password === password);
    if (!found) return false;
    const userData = { name: found.name, email: found.email };
    setUser(userData);
    localStorage.setItem("fhevm_user", JSON.stringify(userData));
    return true;
  };

  const signUp = async (name: string, email: string, password: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem("fhevm_users") || "[]");
    if (users.find((u: { email: string }) => u.email === email)) return false;
    users.push({ name, email, password });
    localStorage.setItem("fhevm_users", JSON.stringify(users));
    const userData = { name, email };
    setUser(userData);
    localStorage.setItem("fhevm_user", JSON.stringify(userData));
    return true;
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("fhevm_user");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
