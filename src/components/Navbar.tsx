"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/curriculum", label: "Curriculum" },
  { href: "/homework", label: "Homework" },
  { href: "/resources", label: "Resources" },
  { href: "/instructor", label: "Instructor" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? "border-b border-[#1a1a1a] bg-[#0A0A0A]/97 backdrop-blur-sm"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        {/* Brand */}
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center bg-[#FFC517] text-[11px] font-black text-[#000000] transition-all group-hover:shadow-[0_0_12px_rgba(255,197,23,0.3)]">
            F
          </span>
          <span className="text-[13px] font-semibold tracking-tight text-[#E0E0E0]">
            FHEVM<span className="text-[#C8C8C8]">.bootcamp</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-0 md:flex">
          {links.map((l) => {
            const active = pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative px-3.5 py-2 text-[12px] font-medium uppercase tracking-wider transition-colors ${
                  active ? "text-[#FFC517]" : "text-[#C8C8C8] hover:text-[#E0E0E0]"
                }`}
              >
                {l.label}
                {active && (
                  <span className="absolute bottom-0 left-1/2 h-px w-4 -translate-x-1/2 bg-[#FFC517] shadow-[0_0_6px_rgba(255,197,23,0.4)]" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="text-[#C8C8C8] transition hover:text-[#FFC517] md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden border-t border-[#1a1a1a] bg-[#0A0A0A]/99 backdrop-blur-sm transition-all duration-200 md:hidden ${
          open ? "max-h-80 opacity-100" : "max-h-0 opacity-0 border-transparent"
        }`}
      >
        <div className="px-6 py-3">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block py-2.5 text-[12px] uppercase tracking-wider transition-colors ${
                pathname.startsWith(l.href) ? "text-[#FFC517]" : "text-[#C8C8C8] hover:text-[#E0E0E0]"
              }`}
            >
              {pathname.startsWith(l.href) ? "> " : "  "}{l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
