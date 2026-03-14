"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ChevronDown, Play, Clock, ArrowRight } from "lucide-react";
import type { Week } from "@/lib/curriculum";
import { getChallengesForWeek } from "@/lib/challenges";
import { useProgress } from "@/context/ProgressContext";

export function WeekDetail({ week }: { week: Week }) {
  const [notesOpen, setNotesOpen] = useState(false);
  const { isCompleted } = useProgress();
  const challenges = getChallengesForWeek(week.number);

  const totalItems = week.lessons.length + challenges.length;
  const completedItems = [...week.lessons.filter((l) => isCompleted(l.id)), ...challenges.filter((c) => isCompleted(c.id))].length;
  const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <div className="mx-auto max-w-4xl px-6 pt-24 pb-20">
      {/* Breadcrumb */}
      <div className="mb-6 animate-fade-in text-[12px] text-[#808080]">
        <Link href="/curriculum" className="transition hover:text-[#C8C8C8]">curriculum</Link>
        <span className="mx-2 text-[#5A5A5A]">/</span>
        <span className="text-[#C8C8C8]">week_{week.number}</span>
      </div>

      {/* Header */}
      <div className="mb-10 animate-fade-in-up">
        <div className="mb-3 flex items-center gap-3">
          <span className="text-3xl font-light text-[#FFC517] leading-none">
            {String(week.number).padStart(2, "0")}
          </span>
          <span className="tag">{week.estimatedTime}</span>
        </div>
        <h1 className="text-2xl font-bold text-[#FFFFFF] md:text-3xl">{week.title}</h1>
        <p className="mt-1 text-[14px] text-[#C8C8C8]">{week.subtitle}</p>

        {/* Progress */}
        <div className="mt-6 flex items-center gap-4">
          <div className="progress-track flex-1">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className={`text-[13px] font-semibold tabular-nums ${progress === 100 ? "text-[#FFC517]" : "text-[#C8C8C8]"}`}>
            {progress}%
          </span>
        </div>
        <div className="mt-2 flex gap-4 text-[11px] text-[#808080]">
          <span>{completedItems}/{totalItems} completed</span>
          <span>{week.lessons.length} lessons</span>
          <span>{challenges.length} challenges</span>
        </div>
      </div>

      {/* Learning Objectives */}
      <div className="t-card mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
        <h2 className="section-label mb-4">// OBJECTIVES</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {week.learningObjectives.map((obj, i) => (
            <div key={i} className="flex gap-2.5 text-[12px] text-[#C8C8C8]">
              <span className="mt-1 text-[#FFC517]">&gt;</span>
              {obj}
            </div>
          ))}
        </div>
      </div>

      {/* Lessons */}
      <div className="mb-6 animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
        <h2 className="section-label mb-4">// LESSONS</h2>
        <div className="stagger space-y-1">
          {week.lessons.map((lesson, i) => {
            const done = isCompleted(lesson.id);
            return (
              <Link
                key={lesson.id}
                href={`/curriculum/week/${week.number}/lesson/${lesson.id}`}
                className="t-card group flex items-center gap-4 !py-3"
              >
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center border text-[11px] ${
                  done
                    ? "border-[#FFC517]/30 bg-[#FFC517]/8 text-[#FFC517]"
                    : "border-[#1a1a1a] text-[#5A5A5A] group-hover:border-[#2a2a2a]"
                }`}>
                  {done ? <Check size={12} /> : String(i + 1).padStart(2, "0")}
                </span>
                <h3 className={`flex-1 text-[13px] font-medium truncate ${done ? "text-[#808080]" : "text-[#E0E0E0]"}`}>
                  {lesson.title}
                </h3>
                <span className="flex items-center gap-1 text-[11px] text-[#808080]">
                  <Clock size={10} />
                  {lesson.duration}
                </span>
                <ArrowRight size={12} className="text-[#5A5A5A] transition group-hover:translate-x-0.5 group-hover:text-[#FFC517]" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Coding Challenges */}
      {challenges.length > 0 && (
        <div className="mb-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <h2 className="section-label mb-4">// CHALLENGES</h2>
          <div className="stagger space-y-1">
            {challenges.map((ch, i) => {
              const done = isCompleted(ch.id);
              return (
                <Link
                  key={ch.id}
                  href={`/curriculum/week/${week.number}/challenge/${ch.id}`}
                  className="t-card group flex items-center gap-4 !py-3"
                >
                  <span className={`flex h-6 w-6 shrink-0 items-center justify-center border text-[11px] ${
                    done
                      ? "border-[#FFC517]/30 bg-[#FFC517]/8 text-[#FFC517]"
                      : "border-[#1a1a1a] text-[#5A5A5A] group-hover:border-[#2a2a2a]"
                  }`}>
                    {done ? <Check size={12} /> : <Play size={10} />}
                  </span>
                  <h3 className={`flex-1 text-[13px] font-medium truncate ${done ? "text-[#808080]" : "text-[#E0E0E0]"}`}>
                    {ch.title}
                  </h3>
                  <span className={`tag text-[10px] ${
                    ch.difficulty === "Starter" ? "text-emerald-400 border-emerald-500/20" :
                    ch.difficulty === "Easy" ? "text-blue-400 border-blue-500/20" :
                    ch.difficulty === "Medium" ? "text-amber-400 border-amber-500/20" :
                    "text-red-400 border-red-500/20"
                  }`}>
                    {ch.difficulty}
                  </span>
                  <ArrowRight size={12} className="text-[#5A5A5A] transition group-hover:translate-x-0.5 group-hover:text-[#FFC517]" />
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Assignment card */}
      <div className="mb-6 animate-fade-in-up" style={{ animationDelay: "0.25s" }}>
        <h2 className="section-label mb-4">// ASSIGNMENT</h2>
        <Link
          href={`/curriculum/week/${week.number}/assignment`}
          className="t-card group flex items-center gap-5"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#FFC517]/20 bg-[#FFC517]/6 text-[#FFC517] text-[14px] font-bold">
            HW
          </span>
          <div className="flex-1">
            <h3 className="text-[14px] font-semibold text-[#FFFFFF] group-hover:text-[#FFC517]">{week.homework.title}</h3>
            <div className="mt-1 flex gap-3 text-[11px] text-[#808080]">
              <span className="tag text-[10px]">{week.homework.difficulty}</span>
              <span>{week.homework.estimatedTime}</span>
              <span className="text-[#FFC517]/60">{week.homework.totalPoints} pts</span>
            </div>
          </div>
          <ArrowRight size={14} className="text-[#808080] transition group-hover:translate-x-1 group-hover:text-[#FFC517]" />
        </Link>
      </div>

      {/* Teaching Notes */}
      <div className="mb-8 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
        <button
          onClick={() => setNotesOpen(!notesOpen)}
          className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-[#808080] transition hover:text-[#C8C8C8]"
        >
          // teaching_notes
          <ChevronDown size={12} className={`transition-transform ${notesOpen ? "rotate-180" : ""}`} />
        </button>
        <div className={`overflow-hidden transition-all duration-300 ${notesOpen ? "mt-3 max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="space-y-1">
            {week.instructorNotes.map((note, i) => (
              <div key={i} className="flex items-start gap-3 border border-[#1a1a1a] bg-[#111111] px-4 py-3 text-[12px] text-[#C8C8C8]">
                <span className="text-[#808080]">{String(i + 1).padStart(2, "0")}.</span>
                {note}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Week nav */}
      <div className="flex items-center justify-between border-t border-[#1a1a1a] pt-6">
        {week.number > 1 ? (
          <Link href={`/curriculum/week/${week.number - 1}`} className="group flex items-center gap-2 text-[13px] text-[#808080] transition hover:text-[#FFC517]">
            <ArrowRight size={12} className="rotate-180 transition group-hover:-translate-x-0.5" />
            week_{week.number - 1}
          </Link>
        ) : <div />}
        <Link href="/curriculum" className="tag transition hover:border-[#FFC517] hover:text-[#FFC517]">
          all_tracks
        </Link>
        {week.number < 4 ? (
          <Link href={`/curriculum/week/${week.number + 1}`} className="group flex items-center gap-2 text-[13px] text-[#808080] transition hover:text-[#FFC517]">
            week_{week.number + 1}
            <ArrowRight size={12} className="transition group-hover:translate-x-0.5" />
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}
