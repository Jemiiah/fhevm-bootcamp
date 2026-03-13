"use client";

import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { WEEKS } from "@/lib/curriculum";
import { getChallengesForWeek } from "@/lib/challenges";
import { useProgress } from "@/context/ProgressContext";

export default function CurriculumPage() {
  const { isCompleted } = useProgress();

  return (
    <div className="mx-auto min-h-screen max-w-5xl px-6 pt-24 pb-20">
      <div className="mb-10 animate-fade-in-up">
        <span className="section-label">// CURRICULUM</span>
        <h1 className="mt-3 text-2xl font-bold text-[#E8E8ED] md:text-3xl">Learning Tracks</h1>
        <p className="mt-2 text-[13px] text-[#5A5F73]">
          16 lessons across 4 weeks — from FHE fundamentals to production dApps.
        </p>
      </div>

      <div className="stagger grid gap-4 md:grid-cols-2">
        {WEEKS.map((week) => {
          const challenges = getChallengesForWeek(week.number);
          const totalItems = week.lessons.length + challenges.length;
          const completedItems = [
            ...week.lessons.filter((l) => isCompleted(l.id)),
            ...challenges.filter((c) => isCompleted(c.id)),
          ].length;
          const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

          return (
            <Link
              key={week.number}
              href={`/curriculum/week/${week.number}`}
              className="t-card group flex flex-col"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-2xl font-light text-[#FFC517] leading-none">
                  {String(week.number).padStart(2, "0")}
                </span>
                <div className="flex items-center gap-2">
                  {progress > 0 && (
                    <span className="text-[11px] font-semibold text-[#FFC517]">{progress}%</span>
                  )}
                  <span className="tag text-[10px]">{week.homework.difficulty}</span>
                </div>
              </div>

              <h2 className="text-[16px] font-semibold text-[#E8E8ED] transition group-hover:text-[#FFC517]">
                {week.title}
              </h2>
              <p className="mt-2 text-[13px] text-[#5A5F73]">
                {week.subtitle}
              </p>

              <div className="mt-4 flex-1 space-y-0.5">
                {week.lessons.map((lesson, i) => {
                  const done = isCompleted(lesson.id);
                  return (
                    <div key={lesson.id} className="flex items-center justify-between px-2 py-1.5 text-[12px]">
                      <span className={done ? "text-[#3A3D47] line-through" : "text-[#5A5F73]"}>
                        <span className="mr-2 text-[#2A2D37]">{String(i + 1).padStart(2, "0")}</span>
                        {lesson.title}
                      </span>
                      <span className="flex items-center gap-1 text-[#2A2D37]">
                        <Clock size={9} />
                        {lesson.duration}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Progress bar */}
              <div className="mt-3 progress-track">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-[#1A1D27] pt-3">
                <span className="text-[11px] text-[#3A3D47]">
                  {week.lessons.length} lessons &middot; {challenges.length} challenges &middot; {week.estimatedTime}
                </span>
                <ArrowRight size={12} className="text-[#3A3D47] transition-all group-hover:translate-x-1 group-hover:text-[#FFC517]" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
