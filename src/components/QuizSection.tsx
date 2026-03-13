"use client";

import { useState, useCallback } from "react";
import { CheckCircle, XCircle, RotateCcw, ArrowRight } from "lucide-react";
import type { LessonQuiz } from "@/lib/quizzes";

interface QuizSectionProps {
  quiz: LessonQuiz;
  onComplete: (score: number, total: number) => void;
  completed?: boolean;
  savedScore?: number;
}

export function QuizSection({ quiz, onComplete, completed = false, savedScore }: QuizSectionProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    new Array(quiz.questions.length).fill(null)
  );
  const [showResult, setShowResult] = useState<boolean[]>(
    new Array(quiz.questions.length).fill(false)
  );
  const [finished, setFinished] = useState(completed);
  const [score, setScore] = useState(savedScore ?? 0);

  const question = quiz.questions[currentQ];
  const totalQuestions = quiz.questions.length;
  const selected = selectedAnswers[currentQ];
  const revealed = showResult[currentQ];

  const selectAnswer = useCallback(
    (index: number) => {
      if (revealed) return;
      setSelectedAnswers((prev) => {
        const next = [...prev];
        next[currentQ] = index;
        return next;
      });
    },
    [currentQ, revealed]
  );

  const checkAnswer = useCallback(() => {
    setShowResult((prev) => {
      const next = [...prev];
      next[currentQ] = true;
      return next;
    });
  }, [currentQ]);

  const nextQuestion = useCallback(() => {
    if (currentQ < totalQuestions - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      const correct = selectedAnswers.filter(
        (ans, i) => ans === quiz.questions[i].correctIndex
      ).length;
      setScore(correct);
      setFinished(true);
      onComplete(correct, totalQuestions);
    }
  }, [currentQ, totalQuestions, selectedAnswers, quiz.questions, onComplete]);

  const retakeQuiz = useCallback(() => {
    setCurrentQ(0);
    setSelectedAnswers(new Array(totalQuestions).fill(null));
    setShowResult(new Array(totalQuestions).fill(false));
    setFinished(false);
    setScore(0);
  }, [totalQuestions]);

  // Finished state
  if (finished) {
    const pct = Math.round((score / totalQuestions) * 100);
    return (
      <div className="t-card">
        <div className="flex items-center gap-3 mb-4">
          <span className={`text-[14px] font-bold ${pct >= 70 ? "text-[#FFC517]" : "text-[#FF4444]"}`}>
            {pct >= 70 ? "PASSED" : "FAILED"}
          </span>
          <span className="text-[12px] text-[#3A3D47]">
            {score}/{totalQuestions} correct ({pct}%)
          </span>
        </div>

        <p className="mb-4 text-[12px] text-[#5A5F73]">
          {pct >= 90 ? "> Excellent. You've mastered this lesson." :
           pct >= 70 ? "> Good. You understand the key concepts." :
           "> Review the lesson material and try again."}
        </p>

        {/* Answer summary */}
        <div className="mb-4 space-y-1">
          {quiz.questions.map((q, i) => {
            const correct = selectedAnswers[i] === q.correctIndex;
            return (
              <div key={q.id} className={`flex items-center gap-2.5 px-3 py-2 text-[12px] border ${
                correct ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400" : "border-red-500/20 bg-red-500/5 text-red-400"
              }`}>
                {correct ? <CheckCircle size={12} /> : <XCircle size={12} />}
                <span className="text-[#5A5F73] truncate">{q.question.slice(0, 80)}...</span>
              </div>
            );
          })}
        </div>

        <button
          onClick={retakeQuiz}
          className="flex items-center gap-2 border border-[#1A1D27] bg-[#0F1117] px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#5A5F73] transition hover:border-[#2A2D37] hover:text-[#B8BCC8]"
        >
          <RotateCcw size={12} />
          retake
        </button>
      </div>
    );
  }

  return (
    <div className="t-card">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-widest text-[#3A3D47]">
          quiz
        </span>
        <span className="text-[12px] text-[#3A3D47] tabular-nums">
          {currentQ + 1}/{totalQuestions}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-5 progress-track">
        <div
          className="progress-fill"
          style={{ width: `${((currentQ + (revealed ? 1 : 0)) / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Question */}
      <p className="mb-5 text-[14px] font-medium text-[#E8E8ED]">
        {question.question}
      </p>

      {/* Options */}
      <div className="mb-5 space-y-1.5">
        {question.options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = i === question.correctIndex;
          let style = "border-[#1A1D27] bg-[#0F1117] text-[#5A5F73] hover:border-[#2A2D37]";

          if (revealed) {
            if (isCorrect) {
              style = "border-emerald-500/30 bg-emerald-500/5 text-emerald-400";
            } else if (isSelected && !isCorrect) {
              style = "border-red-500/30 bg-red-500/5 text-red-400";
            } else {
              style = "border-[#1A1D27] bg-[#0C0D14] text-[#2A2D37]";
            }
          } else if (isSelected) {
            style = "border-[#FFC517]/30 bg-[#FFC517]/5 text-[#E8E8ED]";
          }

          return (
            <button
              key={i}
              onClick={() => selectAnswer(i)}
              disabled={revealed}
              className={`w-full border px-4 py-3 text-left text-[13px] transition ${style}`}
            >
              <span className="mr-3 inline-flex h-5 w-5 items-center justify-center border border-[#1A1D27] bg-[#0C0D14] text-[11px] text-[#3A3D47]">
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {revealed && (
        <div className={`mb-5 border-l-2 px-4 py-3 text-[12px] ${
          selected === question.correctIndex
            ? "border-emerald-500 bg-emerald-500/5 text-[#5A5F73]"
            : "border-red-500 bg-red-500/5 text-[#5A5F73]"
        }`}>
          {selected === question.correctIndex ? (
            <span className="font-semibold text-emerald-400">CORRECT. </span>
          ) : (
            <span className="font-semibold text-red-400">INCORRECT. </span>
          )}
          {question.explanation}
        </div>
      )}

      {/* Action button */}
      <div className="flex justify-end">
        {!revealed ? (
          <button
            onClick={checkAnswer}
            disabled={selected === null}
            className="bg-[#FFC517] px-5 py-2 text-[11px] font-bold uppercase tracking-wider text-[#0A0A0F] transition hover:bg-white disabled:opacity-30"
          >
            check
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            className="flex items-center gap-2 border border-[#1A1D27] bg-[#0F1117] px-5 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#B8BCC8] transition hover:border-[#2A2D37]"
          >
            {currentQ < totalQuestions - 1 ? "next" : "finish"}
            <ArrowRight size={12} />
          </button>
        )}
      </div>
    </div>
  );
}
