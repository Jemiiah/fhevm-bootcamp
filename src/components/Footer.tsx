import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[#1a1a1a] bg-[#0A0A0A]">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center bg-[#FFC517] text-[10px] font-black text-[#000000]">
                F
              </span>
              <span className="text-[12px] font-semibold text-[#E0E0E0]">
                FHEVM<span className="text-[#808080]">.bootcamp</span>
              </span>
            </div>
            <p className="mt-3 text-[12px] leading-relaxed text-[#808080]">
              A 4-week intensive program to master confidential smart contracts
              using Fully Homomorphic Encryption on the EVM.
            </p>
            <p className="mt-2 text-[11px] text-[#5A5A5A]">
              Powered by{" "}
              <a href="https://www.zama.ai" target="_blank" rel="noopener noreferrer" className="text-[#808080] transition hover:text-[#FFC517]">
                Zama
              </a>
            </p>
          </div>

          {/* Curriculum */}
          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-widest text-[#C8C8C8]">
              Curriculum
            </h4>
            <ul className="mt-3 space-y-2">
              {[
                { href: "/curriculum/week/1", label: "Week 1: Foundations" },
                { href: "/curriculum/week/2", label: "Week 2: Toolkit" },
                { href: "/curriculum/week/3", label: "Week 3: Applications" },
                { href: "/curriculum/week/4", label: "Week 4: Mastery" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[12px] text-[#808080] transition hover:text-[#FFC517]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-widest text-[#C8C8C8]">
              Platform
            </h4>
            <ul className="mt-3 space-y-2">
              {[
                { href: "/curriculum", label: "Full Curriculum" },
                { href: "/homework", label: "Assignments" },
                { href: "/resources", label: "Resources" },
                { href: "/instructor", label: "Instructor Guide" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[12px] text-[#808080] transition hover:text-[#FFC517]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* External */}
          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-widest text-[#C8C8C8]">
              Resources
            </h4>
            <ul className="mt-3 space-y-2">
              {[
                { href: "https://docs.zama.org/protocol", label: "Zama Protocol Docs" },
                { href: "https://github.com/zama-ai/fhevm", label: "GitHub" },
                { href: "https://discord.gg/zama", label: "Discord Community" },
                { href: "https://zama.org/developer-hub", label: "Developer Program" },
              ].map((l) => (
                <li key={l.href}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-[12px] text-[#808080] transition hover:text-[#FFC517]">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-[#1a1a1a] pt-6 sm:flex-row">
          <p className="text-[11px] text-[#5A5A5A]">
            &copy; {new Date().getFullYear()} FHEVM Bootcamp. Built for the Zama Developer Program.
          </p>
          <div className="flex items-center gap-4">
            <a href="https://github.com/zama-ai/fhevm" target="_blank" rel="noopener noreferrer" className="text-[11px] text-[#5A5A5A] transition hover:text-[#FFC517]">
              [github]
            </a>
            <a href="https://discord.gg/zama" target="_blank" rel="noopener noreferrer" className="text-[11px] text-[#5A5A5A] transition hover:text-[#FFC517]">
              [discord]
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
