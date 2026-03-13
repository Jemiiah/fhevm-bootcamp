"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface QuizScore {
  score: number;
  total: number;
}

interface ProgressContextType {
  completedLessons: Set<string>;
  toggleLesson: (lessonId: string) => void;
  isCompleted: (lessonId: string) => boolean;
  getWeekProgress: (weekNumber: number, totalLessons: number) => number;
  saveQuizScore: (lessonId: string, score: number, total: number) => void;
  getQuizScore: (lessonId: string) => number | null;
  getQuizData: (lessonId: string) => QuizScore | null;
}

const ProgressContext = createContext<ProgressContextType | null>(null);

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider");
  return ctx;
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [quizScores, setQuizScores] = useState<Record<string, QuizScore>>({});

  useEffect(() => {
    const stored = localStorage.getItem("fhevm_progress");
    if (stored) {
      try { setCompletedLessons(new Set(JSON.parse(stored))); } catch { /* ignore */ }
    }
    const storedQuizzes = localStorage.getItem("fhevm_quizzes");
    if (storedQuizzes) {
      try { setQuizScores(JSON.parse(storedQuizzes)); } catch { /* ignore */ }
    }
  }, []);

  const saveProgress = (lessons: Set<string>) => {
    localStorage.setItem("fhevm_progress", JSON.stringify([...lessons]));
  };

  const saveQuizzes = (scores: Record<string, QuizScore>) => {
    localStorage.setItem("fhevm_quizzes", JSON.stringify(scores));
  };

  const toggleLesson = (lessonId: string) => {
    setCompletedLessons((prev) => {
      const next = new Set(prev);
      if (next.has(lessonId)) next.delete(lessonId);
      else next.add(lessonId);
      saveProgress(next);
      return next;
    });
  };

  const isCompleted = (lessonId: string) => completedLessons.has(lessonId);

  const getWeekProgress = (weekNumber: number, totalLessons: number) => {
    if (totalLessons === 0) return 0;
    const count = [...completedLessons].filter((id) => id.startsWith(`w${weekNumber}`)).length;
    return Math.round((count / totalLessons) * 100);
  };

  const saveQuizScore = (lessonId: string, score: number, total: number) => {
    setQuizScores((prev) => {
      const next = { ...prev, [lessonId]: { score, total } };
      saveQuizzes(next);
      return next;
    });
  };

  const getQuizScore = (lessonId: string): number | null => {
    const data = quizScores[lessonId];
    return data ? data.score : null;
  };

  const getQuizData = (lessonId: string): QuizScore | null => {
    return quizScores[lessonId] ?? null;
  };

  return (
    <ProgressContext.Provider
      value={{
        completedLessons,
        toggleLesson,
        isCompleted,
        getWeekProgress,
        saveQuizScore,
        getQuizScore,
        getQuizData,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}
