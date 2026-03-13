"use client";

import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { WEEKS } from "@/lib/curriculum";

export default function HomeworkPage() {
  return (
    <div className="mx-auto min-h-screen max-w-5xl px-6 pt-24 pb-20">
      <div className="mb-10 animate-fade-in-up">
        <span className="section-label">// ASSIGNMENTS</span>
        <h1 className="mt-3 text-2xl font-bold text-[#E8E8ED] md:text-3xl">Weekly Projects</h1>
        <p className="mt-2 text-[13px] text-[#5A5F73]">
          Four progressive projects — from encrypted vaults to a full capstone dApp.
        </p>
      </div>

      <div className="stagger grid gap-4 md:grid-cols-2">
        {WEEKS.map((week) => (
          <Link
            key={week.number}
            href={`/curriculum/week/${week.number}/assignment`}
            className="t-card group flex flex-col"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-2xl font-light text-[#FFC517] leading-none">
                {String(week.number).padStart(2, "0")}
              </span>
              <span className={`tag text-[10px] ${
                week.homework.difficulty === "Beginner" ? "text-emerald-400 border-emerald-500/20" :
                week.homework.difficulty === "Intermediate" ? "text-blue-400 border-blue-500/20" :
                week.homework.difficulty === "Advanced" ? "text-amber-400 border-amber-500/20" :
                "text-red-400 border-red-500/20"
              }`}>
                {week.homework.difficulty}
              </span>
            </div>

            <h2 className="text-[15px] font-semibold text-[#E8E8ED] transition group-hover:text-[#FFC517]">
              {week.homework.title}
            </h2>
            <p className="mt-2 flex-1 text-[12px] text-[#5A5F73]">
              {week.homework.description.slice(0, 150)}...
            </p>

            <div className="mt-4 flex items-center justify-between border-t border-[#1A1D27] pt-3 text-[11px] text-[#3A3D47]">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1"><Clock size={9} /> {week.homework.estimatedTime}</span>
                <span className="text-[#FFC517]/60 font-medium">{week.homework.totalPoints} pts</span>
                <span>{week.homework.requirements.length} reqs</span>
              </div>
              <ArrowRight size={12} className="text-[#3A3D47] transition-all group-hover:translate-x-1 group-hover:text-[#FFC517]" />
            </div>
          </Link>
        ))}
      </div>

      {/* Grading */}
      <div className="mt-14 t-card animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
        <h2 className="section-label mb-4">// GRADING_SCALE</h2>
        <p className="mb-5 text-[13px] text-[#5A5F73]">
          All assignments use a 100-point scale. Grading emphasizes correct use of FHE
          patterns over code style.
        </p>
        <div className="grid grid-cols-5 gap-2 text-center">
          {[
            { grade: "A", range: "90-100", label: "Distinction", color: "#FFC517" },
            { grade: "B", range: "80-89", label: "Proficient", color: "#00D4AA" },
            { grade: "C", range: "70-79", label: "Competent", color: "#3B82F6" },
            { grade: "D", range: "60-69", label: "Developing", color: "#FFAA00" },
            { grade: "F", range: "<60", label: "Incomplete", color: "#FF4444" },
          ].map((g) => (
            <div
              key={g.grade}
              className="border border-[#1A1D27] bg-[#0F1117] py-4 transition hover:border-[#2A2D37]"
            >
              <div className="text-lg font-bold" style={{ color: g.color }}>{g.grade}</div>
              <div className="mt-1 text-[11px] text-[#5A5F73]">{g.range}</div>
              <div className="text-[10px] text-[#3A3D47]">{g.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
