"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const links = [
  { href: "/curriculum", label: "Curriculum" },
  { href: "/homework", label: "Homework" },
  { href: "/resources", label: "Resources" },
  { href: "/instructor", label: "Instructor" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname === "/auth") return null;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? "border-b border-[#1A1D27] bg-[#0A0A0F]/95 backdrop-blur-sm"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        {/* Brand */}
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center bg-[#FFC517] text-[11px] font-black text-[#0A0A0F] transition-all group-hover:shadow-[0_0_12px_rgba(255,197,23,0.3)]">
            F
          </span>
          <span className="text-[13px] font-semibold tracking-tight text-[#B8BCC8]">
            FHEVM<span className="text-[#5A5F73]">.bootcamp</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-0 md:flex">
          {user && links.map((l) => {
            const active = pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative px-3.5 py-2 text-[12px] font-medium uppercase tracking-wider transition-colors ${
                  active ? "text-[#FFC517]" : "text-[#5A5F73] hover:text-[#B8BCC8]"
                }`}
              >
                {l.label}
                {active && (
                  <span className="absolute bottom-0 left-1/2 h-px w-4 -translate-x-1/2 bg-[#FFC517] shadow-[0_0_6px_rgba(255,197,23,0.4)]" />
                )}
              </Link>
            );
          })}
          {user ? (
            <div className="ml-4 flex items-center gap-3 border-l border-[#1A1D27] pl-4">
              <span className="text-[11px] text-[#FFC517]">
                {user.name}
              </span>
              <button
                onClick={signOut}
                className="text-[11px] text-[#3A3D47] uppercase tracking-wider transition hover:text-[#FF4444]"
              >
                [logout]
              </button>
            </div>
          ) : (
            <Link
              href="/auth"
              className="ml-4 bg-[#FFC517] px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#0A0A0F] transition hover:bg-white hover:shadow-[0_0_12px_rgba(255,197,23,0.2)]"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="text-[#5A5F73] transition hover:text-[#FFC517] md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden border-t border-[#1A1D27] bg-[#0A0A0F]/98 backdrop-blur-sm transition-all duration-200 md:hidden ${
          open ? "max-h-80 opacity-100" : "max-h-0 opacity-0 border-transparent"
        }`}
      >
        <div className="px-6 py-3">
          {user && links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block py-2.5 text-[12px] uppercase tracking-wider transition-colors ${
                pathname.startsWith(l.href) ? "text-[#FFC517]" : "text-[#5A5F73] hover:text-[#B8BCC8]"
              }`}
            >
              {pathname.startsWith(l.href) ? "> " : "  "}{l.label}
            </Link>
          ))}
          {user ? (
            <button
              onClick={() => { signOut(); setOpen(false); }}
              className="mt-3 block w-full border border-[#1A1D27] bg-[#0F1117] py-2.5 text-center text-[12px] uppercase tracking-wider text-[#5A5F73] transition hover:border-[#FF4444] hover:text-[#FF4444]"
            >
              Sign Out
            </button>
          ) : (
            <Link
              href="/auth"
              onClick={() => setOpen(false)}
              className="mt-3 block bg-[#FFC517] py-2.5 text-center text-[12px] font-bold uppercase tracking-wider text-[#0A0A0F]"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
