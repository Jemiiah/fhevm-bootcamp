"use client";

import { useState } from "react";
import { WEEKS } from "@/lib/curriculum";

type Section = "format" | "weeks" | "mistakes" | "pacing" | "setup" | "assessment";

const mistakes = [
  { title: "Using require() with encrypted values", fix: "Use FHE.select instead of conditional reverts" },
  { title: "Forgetting FHE.allowThis()", fix: "Contract can't reuse its own handles without this" },
  { title: "Forgetting FHE.allow()", fix: "Users can't decrypt their data without permission grants" },
  { title: "Using if/else with encrypted conditions", fix: "Must use FHE.select for conditional logic" },
  { title: "Reusing inputs across contracts", fix: "Proofs are bound to a specific (contract, user) pair" },
  { title: "Skipping FHE.fromExternal()", fix: "Raw external encrypted types need validation first" },
  { title: "Wrong handle order in checkSignatures", fix: "Decryption proof is bound to exact handle order" },
];

const sections: { key: Section; label: string }[] = [
  { key: "format", label: "format" },
  { key: "weeks", label: "weekly" },
  { key: "mistakes", label: "mistakes" },
  { key: "pacing", label: "pacing" },
  { key: "setup", label: "lab_setup" },
  { key: "assessment", label: "assessment" },
];

export default function InstructorPage() {
  const [active, setActive] = useState<Section>("format");

  return (
    <div className="mx-auto min-h-screen max-w-5xl px-6 pt-24 pb-20">
      <div className="mb-8 animate-fade-in-up">
        <span className="section-label">// INSTRUCTOR</span>
        <h1 className="mt-3 text-2xl font-bold text-[#E8E8ED]">Instructor Guide</h1>
        <p className="mt-2 text-[13px] text-[#5A5F73]">
          Teaching notes, pacing, and assessment guidelines.
        </p>
      </div>

      {/* Section nav */}
      <div className="mb-6 flex flex-wrap gap-1">
        {sections.map((s) => (
          <button
            key={s.key}
            onClick={() => setActive(s.key)}
            className={`px-4 py-2 text-[11px] font-semibold uppercase tracking-wider transition ${
              active === s.key
                ? "bg-[#FFC517]/8 text-[#FFC517] border border-[#FFC517]/20"
                : "text-[#3A3D47] border border-transparent hover:text-[#5A5F73]"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Format */}
      {active === "format" && (
        <div className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="t-card">
              <h3 className="text-[13px] font-semibold text-[#E8E8ED]">Cohort-Based</h3>
              <p className="mt-2 text-[12px] text-[#5A5F73]">
                2 sessions/week &times; 3 hours each, 4 weeks total.
              </p>
            </div>
            <div className="t-card">
              <h3 className="text-[13px] font-semibold text-[#E8E8ED]">Self-Paced</h3>
              <p className="mt-2 text-[12px] text-[#5A5F73]">
                ~55 hours total. Weekly deadlines recommended.
              </p>
            </div>
          </div>
          <div className="t-card">
            <h3 className="text-[13px] font-semibold text-[#E8E8ED]">Prerequisites</h3>
            <p className="mt-2 text-[12px] text-[#5A5F73]">
              Basic Ethereum &amp; Solidity, Hardhat experience. No FHE background required.
            </p>
          </div>
        </div>
      )}

      {/* Week notes */}
      {active === "weeks" && (
        <div className="space-y-3">
          {WEEKS.map((week) => (
            <div key={week.number} className="t-card">
              <h3 className="mb-3 text-[13px] font-semibold text-[#E8E8ED]">
                Week {week.number}: {week.title}
                <span className="ml-2 text-[11px] font-normal text-[#3A3D47]">{week.estimatedTime}</span>
              </h3>
              <div className="space-y-1">
                {week.instructorNotes.map((note, i) => (
                  <div key={i} className="flex items-start gap-3 border border-[#1a1a1a] bg-[#080808] px-4 py-2.5 text-[12px] text-[#5A5F73]">
                    <span className="text-[#3A3D47]">{String(i + 1).padStart(2, "0")}.</span>
                    {note}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Common mistakes */}
      {active === "mistakes" && (
        <div className="grid gap-3 md:grid-cols-2">
          {mistakes.map((m, i) => (
            <div key={i} className="t-card">
              <h3 className="text-[13px] font-medium text-[#FF4444]">{m.title}</h3>
              <p className="mt-1.5 text-[12px] text-[#5A5F73]">
                <span className="text-[#FFC517]">&gt; fix:</span> {m.fix}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Pacing */}
      {active === "pacing" && (
        <div className="t-card !p-0 overflow-hidden">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-[#1a1a1a] text-[#3A3D47]">
                <th className="px-5 py-3 text-left text-[10px] uppercase tracking-widest font-semibold">Week</th>
                <th className="px-5 py-3 text-left text-[10px] uppercase tracking-widest font-semibold">Focus</th>
                <th className="px-5 py-3 text-left text-[10px] uppercase tracking-widest font-semibold">Hours</th>
                <th className="px-5 py-3 text-left text-[10px] uppercase tracking-widest font-semibold">Key Challenge</th>
              </tr>
            </thead>
            <tbody>
              {[
                { w: 1, focus: "Foundations", hours: "10-12", challenge: "Understanding symbolic execution" },
                { w: 2, focus: "Toolkit", hours: "12-14", challenge: "FHE.select vs if/else paradigm" },
                { w: 3, focus: "Applications", hours: "14-16", challenge: "Full app architecture" },
                { w: 4, focus: "Capstone", hours: "16-20", challenge: "Scoping and time management" },
              ].map((row) => (
                <tr key={row.w} className="border-b border-[#1a1a1a]">
                  <td className="px-5 py-3 text-[#FFC517]">{String(row.w).padStart(2, "0")}</td>
                  <td className="px-5 py-3 text-[#B8BCC8]">{row.focus}</td>
                  <td className="px-5 py-3 text-[#5A5F73]">{row.hours}h</td>
                  <td className="px-5 py-3 text-[#3A3D47]">{row.challenge}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Lab Setup */}
      {active === "setup" && (
        <div className="t-card space-y-3">
          {[
            { step: "Install Node.js LTS", cmd: "node -v  # v18, v20, or v22" },
            { step: "Clone the template", cmd: "git clone https://github.com/zama-ai/fhevm-hardhat-template" },
            { step: "Install dependencies", cmd: "cd fhevm-hardhat-template && npm install" },
            { step: "Configure environment", cmd: "npx hardhat vars set MNEMONIC\nnpx hardhat vars set INFURA_API_KEY" },
            { step: "Compile", cmd: "npx hardhat compile" },
            { step: "Run tests", cmd: "npx hardhat test" },
          ].map((s, i) => (
            <div key={i}>
              <span className="text-[12px] text-[#5A5F73]">
                <span className="text-[#FFC517]">{String(i + 1).padStart(2, "0")}.</span> {s.step}
              </span>
              <pre className="mt-1 !border-[#1a1a1a] !bg-[#080808] px-4 py-2 text-[11px] text-[#3A3D47]">
                <code>{s.cmd}</code>
              </pre>
            </div>
          ))}
        </div>
      )}

      {/* Assessment */}
      {active === "assessment" && (
        <div className="t-card space-y-1">
          {[
            "Grade on FHE correctness first, code style second.",
            "The no-op transfer pattern is a key competency indicator.",
            "Look for proper ACL management — it shows real understanding.",
            "Min test coverage: 5 tests for weeks 1-2, 10 for week 3, 15 for capstone.",
            "For capstone: weight originality and ambition alongside correctness.",
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-3 border border-[#1a1a1a] bg-[#080808] px-4 py-3 text-[12px] text-[#5A5F73]">
              <span className="text-[#FFC517]">&gt;</span>
              {tip}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
