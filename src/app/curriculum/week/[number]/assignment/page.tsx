"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Clock, ArrowRight, CheckCircle } from "lucide-react";
import { getWeek } from "@/lib/curriculum";

export default function AssignmentPage() {
  const params = useParams<{ number: string }>();
  const weekNumber = Number(params.number);
  const week = getWeek(weekNumber);

  if (!week) {
    return (
      <div className="mx-auto max-w-4xl px-6 pt-24 pb-20 text-center">
        <h1 className="text-xl font-bold text-[#FFFFFF]">Assignment not found</h1>
        <Link href="/curriculum" className="mt-4 inline-block text-[12px] text-[#808080] hover:text-[#FFC517]">
          &larr; back to curriculum
        </Link>
      </div>
    );
  }

  const hw = week.homework;

  return (
    <div className="mx-auto max-w-4xl px-6 pt-24 pb-20">
      {/* Breadcrumb */}
      <div className="mb-6 animate-fade-in text-[12px] text-[#808080]">
        <Link href="/curriculum" className="transition hover:text-[#C8C8C8]">curriculum</Link>
        <span className="mx-2 text-[#5A5A5A]">/</span>
        <Link href={`/curriculum/week/${weekNumber}`} className="transition hover:text-[#C8C8C8]">week_{weekNumber}</Link>
        <span className="mx-2 text-[#5A5A5A]">/</span>
        <span className="text-[#C8C8C8]">assignment</span>
      </div>

      {/* Header */}
      <div className="mb-8 animate-fade-in-up">
        <div className="mb-3 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center bg-[#FFC517]/8 border border-[#FFC517]/20 text-[#FFC517] text-[13px] font-bold">
            HW
          </span>
          <div className="flex items-center gap-2">
            <span className="tag">
              <Clock size={10} /> {hw.estimatedTime}
            </span>
            <span className={`tag text-[10px] ${
              hw.difficulty === "Beginner" ? "text-emerald-400 border-emerald-500/20" :
              hw.difficulty === "Intermediate" ? "text-blue-400 border-blue-500/20" :
              hw.difficulty === "Advanced" ? "text-amber-400 border-amber-500/20" :
              "text-red-400 border-red-500/20"
            }`}>
              {hw.difficulty}
            </span>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-[#FFFFFF] md:text-3xl">{hw.title}</h1>
      </div>

      {/* Description */}
      <p className="mb-8 animate-fade-in-up text-[14px] leading-[1.75] text-[#C8C8C8]" style={{ animationDelay: "0.1s" }}>
        {hw.description}
      </p>

      {/* Requirements */}
      <div className="mb-8 animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
        <h2 className="section-label mb-3">// REQUIREMENTS</h2>
        <div className="stagger space-y-1">
          {hw.requirements.map((r, i) => (
            <div key={i} className="flex items-start gap-3 border border-[#1a1a1a] bg-[#111111] px-4 py-3 text-[13px] text-[#C8C8C8]">
              <span className="text-[#FFC517]">{String(i + 1).padStart(2, "0")}.</span>
              {r}
            </div>
          ))}
        </div>
      </div>

      {/* Grading */}
      <div className="mb-8 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
        <h2 className="section-label mb-3">// GRADING_CRITERIA</h2>
        <div className="t-card !p-0 overflow-hidden">
          {hw.gradingCriteria.map((g, i) => (
            <div
              key={i}
              className={`flex items-center justify-between px-4 py-3 text-[12px] ${
                i !== hw.gradingCriteria.length - 1 ? "border-b border-[#1a1a1a]" : ""
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle size={11} className="text-[#5A5A5A]" />
                <span className="text-[#C8C8C8]">{g.criterion}</span>
              </div>
              <span className="font-semibold tabular-nums text-[#E0E0E0]">{g.points} pts</span>
            </div>
          ))}
          <div className="flex items-center justify-between border-t border-[#FFC517]/15 bg-[#FFC517]/3 px-4 py-3 text-[13px]">
            <span className="font-semibold text-[#FFFFFF]">Total</span>
            <span className="font-bold text-[#FFC517]">{hw.totalPoints} pts</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between border-t border-[#1a1a1a] pt-6 animate-fade-in-up" style={{ animationDelay: "0.25s" }}>
        <Link
          href={`/curriculum/week/${weekNumber}`}
          className="group flex items-center gap-2 text-[12px] text-[#808080] transition hover:text-[#FFC517]"
        >
          <ArrowRight size={12} className="rotate-180 transition group-hover:-translate-x-0.5" />
          week_{weekNumber}
        </Link>
        {weekNumber < 4 && (
          <Link
            href={`/curriculum/week/${weekNumber + 1}`}
            className="group flex items-center gap-2 text-[12px] text-[#808080] transition hover:text-[#FFC517]"
          >
            week_{weekNumber + 1}
            <ArrowRight size={12} className="transition group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
