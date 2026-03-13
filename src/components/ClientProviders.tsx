"use client";

import { ProgressProvider } from "@/context/ProgressContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { usePathname } from "next/navigation";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isChallenge = pathname.includes("/challenge/");

  return (
    <ProgressProvider>
      <Navbar />
      <main className={isChallenge ? "" : "min-h-screen"}>{children}</main>
      {!isChallenge && <Footer />}
    </ProgressProvider>
  );
}
