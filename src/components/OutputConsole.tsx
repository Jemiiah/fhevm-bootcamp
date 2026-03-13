"use client";

import { CheckCircle, XCircle } from "lucide-react";
import type { TestResult } from "@/lib/challenges";

interface OutputConsoleProps {
  results: TestResult[] | null;
  score: number;
  maxScore: number;
  isRunning: boolean;
}

export function OutputConsole({ results, score, maxScore, isRunning }: OutputConsoleProps) {
  if (isRunning) {
    return (
      <div className="flex h-full items-center justify-center gap-3 bg-[#000000] text-[#3A3D47]">
        <span className="text-[12px] animate-pulse">running tests...</span>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="flex h-full items-center justify-center bg-[#000000] text-[#2a2a2a]">
        <span className="text-[12px]">&gt; click &quot;run tests&quot; to validate your code</span>
      </div>
    );
  }

  const passed = results.filter((r) => r.passed).length;
  const total = results.length;
  const allPassed = passed === total;

  return (
    <div className="flex h-full flex-col bg-[#000000]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2">
        <span className="text-[10px] uppercase tracking-widest text-[#3A3D47]">
          test_results
        </span>
        <div className="flex items-center gap-3">
          <span className={`text-[12px] font-semibold ${allPassed ? "text-emerald-400" : "text-[#5A5F73]"}`}>
            {passed}/{total} passed
          </span>
          <span className="text-[12px] font-semibold text-[#FFC517]">
            {score}/{maxScore} pts
          </span>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {results.map((r, i) => (
          <div
            key={i}
            className={`flex items-start gap-2.5 px-3 py-2 text-[12px] border ${
              r.passed ? "border-emerald-500/10 bg-emerald-500/3 text-emerald-400" : "border-red-500/10 bg-red-500/3 text-red-400"
            }`}
          >
            {r.passed ? <CheckCircle size={13} className="mt-0.5 shrink-0" /> : <XCircle size={13} className="mt-0.5 shrink-0" />}
            <span>{r.name}</span>
          </div>
        ))}
      </div>

      {/* Success banner */}
      {allPassed && (
        <div className="border-t border-[#FFC517]/20 bg-[#FFC517]/5 px-4 py-3 flex items-center gap-3">
          <span className="text-[#FFC517] font-bold text-[13px]">&gt; ALL TESTS PASSED</span>
          <span className="text-[11px] text-[#3A3D47]">{score} points earned</span>
        </div>
      )}
    </div>
  );
}
