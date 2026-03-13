"use client";

import { useParams } from "next/navigation";
import { useCallback, useState } from "react";
import Link from "next/link";
import { Check, Clock, ArrowRight, Copy, CheckCheck, Lightbulb, AlertTriangle, Info } from "lucide-react";
import { getLesson, getWeek } from "@/lib/curriculum";
import type { ContentBlock } from "@/lib/curriculum";
import { getLessonContent } from "@/lib/lesson-content";
import { getQuizForLesson } from "@/lib/quizzes";
import { useProgress } from "@/context/ProgressContext";
import { QuizSection } from "@/components/QuizSection";

/**
 * NOTE: dangerouslySetInnerHTML is used below ONLY with trusted, developer-authored
 * content from lesson-content.ts (hardcoded strings). No user input is ever rendered
 * this way. This is safe because the content source is our own codebase.
 */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="flex items-center gap-1 px-2 py-1 text-[10px] text-[#3A3D47] transition hover:text-[#FFC517]"
    >
      {copied ? <CheckCheck size={10} /> : <Copy size={10} />}
      {copied ? "copied" : "copy"}
    </button>
  );
}

function formatMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#B8BCC8] font-semibold">$1</strong>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\n\n/g, '</p><p class="mt-3">')
    .replace(/\n/g, "<br/>");
}

function ContentBlockRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "text":
      return (
        <div
          className="text-[13px] leading-[1.85] text-[#5A5F73]"
          dangerouslySetInnerHTML={{ __html: formatMarkdown(block.body) }}
        />
      );

    case "code":
      return (
        <div className="t-card-window">
          <div className="t-titlebar flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="t-dot red" />
              <span className="t-dot yellow" />
              <span className="t-dot green" />
              {block.filename && (
                <span className="ml-2 text-[10px] text-[#3A3D47]">{block.filename}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] uppercase tracking-wider text-[#2a2a2a]">{block.language}</span>
              <CopyButton text={block.body} />
            </div>
          </div>
          <pre className="!border-0 !bg-transparent p-4 text-[12px] leading-[1.8] text-[#5A5F73] overflow-x-auto">
            <code>{block.body}</code>
          </pre>
        </div>
      );

    case "insight":
      return (
        <div className="border-l-2 border-[#FFC517] bg-[#FFC517]/[0.03] px-5 py-4">
          <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#FFC517]">
            <Lightbulb size={12} />
            {block.title}
          </div>
          <div
            className="text-[12px] leading-[1.8] text-[#5A5F73]"
            dangerouslySetInnerHTML={{ __html: formatMarkdown(block.body) }}
          />
        </div>
      );

    case "warning":
      return (
        <div className="border-l-2 border-[#FF4444] bg-[#FF4444]/[0.03] px-5 py-4">
          <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#FF4444]">
            <AlertTriangle size={12} />
            {block.title || "WARNING"}
          </div>
          <div
            className="text-[12px] leading-[1.8] text-[#5A5F73]"
            dangerouslySetInnerHTML={{ __html: formatMarkdown(block.body) }}
          />
        </div>
      );

    case "info":
      return (
        <div className="border-l-2 border-[#3B82F6] bg-[#3B82F6]/[0.03] px-5 py-4">
          <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#3B82F6]">
            <Info size={12} />
            NOTE
          </div>
          <div
            className="text-[12px] leading-[1.8] text-[#5A5F73]"
            dangerouslySetInnerHTML={{ __html: formatMarkdown(block.body) }}
          />
        </div>
      );

    case "list":
      return (
        <div>
          <h3 className="mb-3 text-[12px] font-bold uppercase tracking-wider text-[#B8BCC8]">
            {block.title}
          </h3>
          <div className="space-y-1">
            {block.items.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 border border-[#1a1a1a] bg-[#0a0a0a] px-4 py-3 text-[12px] text-[#5A5F73]"
              >
                <span className="text-[#FFC517] shrink-0">{String(i + 1).padStart(2, "0")}.</span>
                <span dangerouslySetInnerHTML={{ __html: formatMarkdown(item) }} />
              </div>
            ))}
          </div>
        </div>
      );

    default:
      return null;
  }
}

export default function LessonPage() {
  const params = useParams<{ number: string; id: string }>();
  const weekNumber = Number(params.number);
  const result = getLesson(weekNumber, params.id);
  const week = getWeek(weekNumber);

  if (!result || !week) {
    return (
      <div className="mx-auto max-w-4xl px-6 pt-24 pb-20 text-center">
        <h1 className="text-xl font-bold text-[#E8E8ED]">Lesson not found</h1>
        <Link href={`/curriculum/week/${weekNumber}`} className="mt-4 inline-block text-[13px] text-[#3A3D47] hover:text-[#FFC517]">
          &larr; back to week_{weekNumber}
        </Link>
      </div>
    );
  }

  const { lesson, lessonIndex } = result;
  const prevLesson = week.lessons[lessonIndex - 1];
  const nextLesson = week.lessons[lessonIndex + 1];

  return <LessonContent weekNumber={weekNumber} lesson={lesson} lessonIndex={lessonIndex} prevLesson={prevLesson} nextLesson={nextLesson} />;
}

function LessonContent({
  weekNumber,
  lesson,
  lessonIndex,
  prevLesson,
  nextLesson,
}: {
  weekNumber: number;
  lesson: ReturnType<typeof getLesson> extends { lesson: infer L } | undefined ? L : never;
  lessonIndex: number;
  prevLesson?: { id: string; title: string };
  nextLesson?: { id: string; title: string };
}) {
  const { toggleLesson, isCompleted, saveQuizScore, getQuizScore } = useProgress();
  const done = isCompleted(lesson.id);
  const quiz = getQuizForLesson(lesson.id);
  const savedQuizScore = getQuizScore(lesson.id);
  const content = getLessonContent(lesson.id);

  const handleQuizComplete = useCallback(
    (score: number, total: number) => {
      saveQuizScore(lesson.id, score, total);
      if (score / total >= 0.7 && !done) {
        toggleLesson(lesson.id);
      }
    },
    [lesson.id, done, toggleLesson, saveQuizScore]
  );

  return (
    <div className="mx-auto max-w-4xl px-6 pt-24 pb-20">
      {/* Breadcrumb */}
      <div className="mb-6 animate-fade-in text-[12px] text-[#3A3D47]">
        <Link href="/curriculum" className="transition hover:text-[#5A5F73]">curriculum</Link>
        <span className="mx-2 text-[#2a2a2a]">/</span>
        <Link href={`/curriculum/week/${weekNumber}`} className="transition hover:text-[#5A5F73]">week_{weekNumber}</Link>
        <span className="mx-2 text-[#2a2a2a]">/</span>
        <span className="text-[#5A5F73]">lesson_{lessonIndex + 1}</span>
      </div>

      {/* Header */}
      <div className="mb-8 animate-fade-in-up">
        <div className="mb-3 flex items-center gap-3">
          <span className="tag">
            <Clock size={10} /> {lesson.duration}
          </span>
          {done && (
            <span className="tag tag-green">
              <Check size={10} /> COMPLETED
            </span>
          )}
        </div>
        <h1 className="text-2xl font-bold text-[#E8E8ED] md:text-3xl">
          {String(lessonIndex + 1).padStart(2, "0")}. {lesson.title}
        </h1>
      </div>

      {/* Objectives */}
      <div className="mb-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
        <h2 className="section-label mb-3">// LEARNING_OBJECTIVES</h2>
        <div className="space-y-1">
          {lesson.objectives.map((o, i) => (
            <div key={i} className="flex items-start gap-3 border border-[#1a1a1a] bg-[#0a0a0a] px-4 py-3 text-[13px] text-[#5A5F73]">
              <span className="text-[#FFC517]">&gt;</span>
              {o}
            </div>
          ))}
        </div>
      </div>

      {/* Rich Content Blocks */}
      {content && content.length > 0 ? (
        <div className="mb-10 space-y-6 animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
          <h2 className="section-label">// LESSON_CONTENT</h2>
          {content.map((block, i) => (
            <ContentBlockRenderer key={i} block={block} />
          ))}
        </div>
      ) : (
        <>
          {/* Fallback for lessons without rich content */}
          <p className="mb-8 animate-fade-in-up text-[14px] leading-[1.75] text-[#5A5F73]" style={{ animationDelay: "0.15s" }}>
            {lesson.description}
          </p>
          <div className="mb-8 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <h2 className="section-label mb-3">// TOPICS</h2>
            <div className="flex flex-wrap gap-2">
              {lesson.topics.map((t, i) => (
                <span key={i} className="tag">{t}</span>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Quiz Section */}
      {quiz && (
        <div className="mb-8 animate-fade-in-up" style={{ animationDelay: "0.25s" }}>
          <h2 className="section-label mb-3">// KNOWLEDGE_CHECK</h2>
          <QuizSection
            quiz={quiz}
            onComplete={handleQuizComplete}
            completed={savedQuizScore !== null}
            savedScore={savedQuizScore ?? undefined}
          />
        </div>
      )}

      {/* Completion toggle */}
      <div className="animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
        <button
          onClick={() => toggleLesson(lesson.id)}
          className={`group flex items-center gap-3 px-5 py-2.5 text-[12px] font-semibold uppercase tracking-wider transition ${
            done
              ? "bg-[#FFC517]/8 text-[#FFC517] border border-[#FFC517]/20"
              : "bg-[#0a0a0a] text-[#5A5F73] border border-[#1a1a1a] hover:border-[#2a2a2a] hover:text-[#B8BCC8]"
          }`}
        >
          <Check size={14} className={done ? "" : "opacity-50 transition group-hover:opacity-100"} />
          {done ? "> COMPLETED" : "> MARK_COMPLETE"}
        </button>
      </div>

      {/* Prev/Next navigation */}
      <div className="mt-10 flex items-center justify-between border-t border-[#1a1a1a] pt-6">
        {prevLesson ? (
          <Link href={`/curriculum/week/${weekNumber}/lesson/${prevLesson.id}`} className="group flex items-center gap-2 text-[12px] text-[#3A3D47] transition hover:text-[#FFC517]">
            <ArrowRight size={12} className="rotate-180 transition group-hover:-translate-x-0.5" />
            <span className="max-w-[180px] truncate">{prevLesson.title}</span>
          </Link>
        ) : (
          <Link href={`/curriculum/week/${weekNumber}`} className="group flex items-center gap-2 text-[12px] text-[#3A3D47] transition hover:text-[#FFC517]">
            <ArrowRight size={12} className="rotate-180 transition group-hover:-translate-x-0.5" />
            week_overview
          </Link>
        )}
        {nextLesson ? (
          <Link href={`/curriculum/week/${weekNumber}/lesson/${nextLesson.id}`} className="group flex items-center gap-2 text-[12px] text-[#3A3D47] transition hover:text-[#FFC517]">
            <span className="max-w-[180px] truncate">{nextLesson.title}</span>
            <ArrowRight size={12} className="transition group-hover:translate-x-0.5" />
          </Link>
        ) : (
          <Link href={`/curriculum/week/${weekNumber}/assignment`} className="group flex items-center gap-2 text-[12px] text-[#3A3D47] transition hover:text-[#FFC517]">
            assignment
            <ArrowRight size={12} className="transition group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
