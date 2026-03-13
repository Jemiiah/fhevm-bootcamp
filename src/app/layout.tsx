import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "@/components/ClientProviders";

const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FHEVM Bootcamp | Master Confidential Smart Contracts with Zama",
  description:
    "A comprehensive 4-week bootcamp to master Fully Homomorphic Encryption on the EVM. Learn to build confidential smart contracts, encrypted tokens, private voting, and sealed-bid auctions using Zama Protocol.",
  keywords: ["FHEVM", "Zama", "FHE", "bootcamp", "smart contracts", "privacy", "blockchain", "Solidity"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${jetbrains.variable} antialiased scanline`}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
