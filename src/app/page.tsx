"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { TerminalText } from "@/components/TerminalText";

const weeks = [
  { n: 1, title: "Foundations", desc: "FHE concepts, Zama architecture, and your first encrypted contract.", lessons: 4, hours: "12h" },
  { n: 2, title: "Toolkit Mastery", desc: "Encrypted types, operations, ACLs, and decryption patterns.", lessons: 4, hours: "14h" },
  { n: 3, title: "Real-World Apps", desc: "Build confidential voting, sealed auctions, and token wrappers.", lessons: 4, hours: "16h" },
  { n: 4, title: "Mastery & Capstone", desc: "Security, optimization, standard library, and your capstone dApp.", lessons: 4, hours: "20h" },
];

const PIPELINE = [
  { label: "Plaintext 42", type: "data" },
  { label: "Encrypt", type: "op" },
  { label: "euint64 0x7f3a...", type: "data" },
  { label: "FHE.add()", type: "op" },
  { label: "euint64 0xb2c1...", type: "data" },
  { label: "Decrypt", type: "op" },
  { label: "Result 84", type: "data" },
];

const HERO_CODE = `// WEEK 1: Every balance is encrypted on-chain
import "fhevm/lib/FHE.sol";
import "fhevm/config/ZamaEthereumConfig.sol";

contract ConfidentialERC20 is ZamaEthereumConfig {
  mapping(address => euint64) private _balances;

  function transfer(address to, externalEuint64 enc,
    bytes calldata proof) external {
    euint64 amount = FHE.fromExternal(enc, proof);
    ebool  ok = FHE.le(amount, _balances[msg.sender]);

    // No revert — silently no-op if insufficient
    _balances[msg.sender] = FHE.select(ok,
      FHE.sub(_balances[msg.sender], amount),
      _balances[msg.sender]);
    _balances[to] = FHE.select(ok,
      FHE.add(_balances[to], amount),
      _balances[to]);
  }
}`;

const stats = [
  { value: "16", label: "LESSONS" },
  { value: "4", label: "PROJECTS" },
  { value: "60+", label: "HOURS" },
  { value: "40+", label: "CHALLENGES" },
];

function PipelineArrow() {
  return <span className="px-3 text-[#FFC517] opacity-60 animate-pulse">→</span>;
}

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="relative flex min-h-[90vh] flex-col justify-center px-6 pt-14 overflow-hidden">
        <div className="mx-auto max-w-5xl w-full">
          <div className="animate-fade-in-up mb-6">
            <span className="tag tag-green">
              <span className="inline-block h-1.5 w-1.5 bg-[#FFC517] animate-pulse" />
              FHEVM Developer Program 2026
            </span>
          </div>

          <TerminalText
            text="Build encrypted smart contracts on the EVM."
            as="h1"
            className="animate-fade-in-up text-[clamp(28px,5vw,56px)] font-bold leading-[1.1] tracking-tight text-[#E8E8ED]"
            delay={300}
            speed={25}
          />

          <p className="animate-fade-in-up mt-6 max-w-xl text-[15px] leading-relaxed text-[#5A5F73]" style={{ animationDelay: "0.15s" }}>
            Master confidential smart contracts using fully homomorphic encryption.
            4 weeks. 16 lessons. Zero FHE knowledge required.
          </p>

          <div className="animate-fade-in-up mt-8 flex items-center gap-4" style={{ animationDelay: "0.25s" }}>
            <Link
              href="/curriculum"
              className="btn-primary"
            >
              {">"} START_BOOTCAMP
              <ArrowRight size={14} />
            </Link>
            <Link href="/resources" className="btn-outline">
              ./resources
            </Link>
          </div>

          {/* Stats */}
          <div className="animate-fade-in-up mt-14 flex items-center gap-8 md:gap-12" style={{ animationDelay: "0.35s" }}>
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <span className="block text-2xl font-bold text-[#E8E8ED] md:text-3xl">{s.value}</span>
                <span className="mt-1 block text-[10px] tracking-widest text-[#3A3D47]">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Code block */}
          <div className="animate-fade-in-up mt-12 max-w-2xl" style={{ animationDelay: "0.45s" }}>
            <div className="t-card-window">
              <div className="t-titlebar">
                <span className="t-dot red" />
                <span className="t-dot yellow" />
                <span className="t-dot green" />
                <span className="ml-3 text-[11px] text-[#3A3D47]">ConfidentialToken.sol</span>
              </div>
              <pre className="!border-0 !bg-transparent m-0 p-4 text-[12px] leading-relaxed">
                <code className="text-[#7A7F93]">{HERO_CODE}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pipeline Strip ── */}
      <section className="border-t border-b border-[#1a1a1a] py-6 px-6 overflow-x-auto">
        <div className="flex items-center justify-center gap-0 min-w-max">
          {PIPELINE.map((step, i) => (
            <div key={i} className="flex items-center">
              {i > 0 && <PipelineArrow />}
              <span className={`px-3 py-1.5 text-[11px] border whitespace-nowrap ${
                step.type === "op"
                  ? "border-[#FFC517]/20 bg-[#FFC517]/6 text-[#FFC517]"
                  : "border-[#1a1a1a] bg-[#0a0a0a] text-[#5A5F73]"
              }`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Curriculum Grid ── */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="mb-8">
          <span className="section-label">// CURRICULUM</span>
          <TerminalText
            text="Four weeks. One complete engineer."
            as="h2"
            className="mt-3 text-2xl font-bold text-[#E8E8ED] md:text-3xl"
            delay={100}
            speed={20}
          />
          <p className="mt-3 max-w-lg text-[14px] text-[#5A5F73]">
            Every week builds on the last — from encrypted primitives to a production-grade
            system deployed on Sepolia.
          </p>
        </div>

        <div className="stagger grid gap-4 md:grid-cols-2">
          {weeks.map((w) => (
            <Link
              key={w.n}
              href={`/curriculum/week/${w.n}`}
              className="t-card group flex flex-col"
            >
              <span className="text-2xl font-light text-[#FFC517] leading-none mb-3">
                {String(w.n).padStart(2, "0")}
              </span>
              <h3 className="text-[16px] font-semibold text-[#E8E8ED] transition group-hover:text-[#FFC517]">
                {w.title}
              </h3>
              <p className="mt-2 flex-1 text-[13px] text-[#5A5F73]">{w.desc}</p>
              <div className="mt-4 flex items-center justify-between border-t border-[#1a1a1a] pt-3 text-[11px] text-[#3A3D47]">
                <span>{w.lessons} lessons &middot; {w.hours}</span>
                <ArrowRight size={12} className="text-[#3A3D47] transition group-hover:translate-x-1 group-hover:text-[#FFC517]" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* ── CTA ── */}
      <section className="flex flex-col items-center px-6 py-24 text-center">
        <span className="section-label mb-4">// READY?</span>
        <TerminalText
          text="The infrastructure is here. Now we need the builders."
          as="h2"
          className="max-w-xl text-2xl font-bold text-[#E8E8ED] md:text-3xl"
          delay={100}
          speed={20}
        />
        <p className="mt-4 max-w-md text-[14px] text-[#5A5F73]">
          Clone the Hardhat template, follow the Week 1 lesson plan, and deploy your first
          confidential contract in under an hour.
        </p>
        <div className="mt-8 flex items-center gap-4">
          <Link href="/curriculum/week/1" className="btn-primary">
            {">"} BEGIN_WEEK_1
            <ArrowRight size={14} />
          </Link>
          <a
            href="https://github.com/zama-ai/fhevm-hardhat-template"
            target="_blank"
            rel="noreferrer"
            className="btn-outline"
          >
            git clone template
          </a>
        </div>
      </section>
    </div>
  );
}
