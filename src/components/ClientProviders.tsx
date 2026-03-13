"use client";

import { AuthProvider } from "@/context/AuthContext";
import { ProgressProvider } from "@/context/ProgressContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuthGuard } from "@/components/AuthGuard";
import { usePathname } from "next/navigation";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuth = pathname === "/auth";
  const isChallenge = pathname.includes("/challenge/");

  return (
    <AuthProvider>
      <ProgressProvider>
        <Navbar />
        <AuthGuard>
          <main className={isChallenge ? "" : "min-h-screen"}>{children}</main>
        </AuthGuard>
        {!isAuth && !isChallenge && <Footer />}
      </ProgressProvider>
    </AuthProvider>
  );
}
