"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Play, RotateCcw, Eye, EyeOff, ChevronLeft, ChevronRight,
  Lightbulb, CheckCircle, XCircle, FileText, FlaskConical,
  History, BookOpen, Clock,
} from "lucide-react";
import { CodeEditor } from "./CodeEditor";
import type { Challenge, TestResult } from "@/lib/challenges";
import { validateCode } from "@/lib/challenges";
import { useProgress } from "@/context/ProgressContext";

interface Submission {
  timestamp: number;
  score: number;
  maxScore: number;
  passed: number;
  total: number;
  allPassed: boolean;
}

function getSubmissions(challengeId: string): Submission[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(`submissions_${challengeId}`);
  return raw ? JSON.parse(raw) : [];
}

function saveSubmission(challengeId: string, sub: Submission) {
  const existing = getSubmissions(challengeId);
  existing.unshift(sub);
  localStorage.setItem(`submissions_${challengeId}`, JSON.stringify(existing.slice(0, 50)));
}

type LeftTab = "description" | "result" | "submissions" | "solutions";

interface ChallengeLayoutProps {
  challenge: Challenge;
  prevChallenge?: { id: string; title: string };
  nextChallenge?: { id: string; title: string };
}

export function ChallengeLayout({ challenge, prevChallenge, nextChallenge }: ChallengeLayoutProps) {
  const [code, setCode] = useState(challenge.starterCode);
  const [editorTab, setEditorTab] = useState<"solution" | "tests">("solution");
  const [leftTab, setLeftTab] = useState<LeftTab>("description");
  const [results, setResults] = useState<TestResult[] | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [panelWidth, setPanelWidth] = useState(440);
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toggleLesson, isCompleted } = useProgress();

  useEffect(() => {
    setSubmissions(getSubmissions(challenge.id));
  }, [challenge.id]);

  // Drag-to-resize handler
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newWidth = e.clientX - rect.left;
      const min = 280;
      const max = rect.width * 0.6;
      setPanelWidth(Math.min(max, Math.max(min, newWidth)));
    };
    const onMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  const score = results ? results.filter((r) => r.passed).reduce((sum, _, i) => {
    if (results[i].passed) return sum + challenge.validationRules[i].points;
    return sum;
  }, 0) : 0;
  const maxScore = challenge.validationRules.reduce((sum, r) => sum + r.points, 0);
  const done = isCompleted(challenge.id);

  const runTests = useCallback(() => {
    setIsRunning(true);
    setTimeout(() => {
      const testResults = validateCode(code, challenge.validationRules);
      setResults(testResults);
      setIsRunning(false);
      setLeftTab("result");

      const passed = testResults.filter((r) => r.passed).length;
      const allPassed = testResults.every((r) => r.passed);
      const currentScore = testResults.filter((r) => r.passed).reduce((sum, _, i) => {
        if (testResults[i].passed) return sum + challenge.validationRules[i].points;
        return sum;
      }, 0);

      const sub: Submission = {
        timestamp: Date.now(),
        score: currentScore,
        maxScore,
        passed,
        total: testResults.length,
        allPassed,
      };
      saveSubmission(challenge.id, sub);
      setSubmissions(getSubmissions(challenge.id));

      if (allPassed && !done) {
        toggleLesson(challenge.id);
      }
    }, 600);
  }, [code, challenge, done, toggleLesson, maxScore]);

  const resetCode = useCallback(() => {
    setCode(challenge.starterCode);
    setResults(null);
    setShowSolution(false);
    setLeftTab("description");
  }, [challenge]);

  const leftTabs: { key: LeftTab; label: string; icon: React.ReactNode }[] = [
    { key: "description", label: "Description", icon: <FileText size={12} /> },
    { key: "result", label: "Result", icon: <FlaskConical size={12} /> },
    { key: "submissions", label: "Submissions", icon: <History size={12} /> },
    { key: "solutions", label: "Solutions", icon: <BookOpen size={12} /> },
  ];

  return (
    <div className="flex h-screen flex-col bg-[#0A0A0A] pt-14">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-[#1a1a1a] bg-[#0D0D0D] px-4 py-2">
        <div className="flex items-center gap-3">
          <Link
            href={`/curriculum/week/${challenge.weekNumber}`}
            className="group flex items-center gap-1.5 px-2 py-1 text-[11px] text-[#808080] transition hover:text-[#FFC517]"
          >
            <ChevronLeft size={12} />
            week_{challenge.weekNumber}
          </Link>
          <span className="h-3 w-px bg-[#1a1a1a]" />
          <h1 className="text-[12px] font-medium text-[#E0E0E0]">{challenge.title}</h1>
          <span className={`tag text-[9px] ${
            challenge.difficulty === "Starter" ? "text-emerald-400 border-emerald-500/20" :
            challenge.difficulty === "Easy" ? "text-blue-400 border-blue-500/20" :
            challenge.difficulty === "Medium" ? "text-amber-400 border-amber-500/20" :
            "text-red-400 border-red-500/20"
          }`}>
            {challenge.difficulty}
          </span>
          {done && (
            <span className="tag tag-green text-[9px]">
              <CheckCircle size={9} />
              SOLVED
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {prevChallenge && (
            <Link
              href={`/curriculum/week/${challenge.weekNumber}/challenge/${prevChallenge.id}`}
              className="px-2 py-1 text-[11px] text-[#808080] transition hover:text-[#FFC517]"
            >
              <ChevronLeft size={12} className="inline" /> prev
            </Link>
          )}
          {nextChallenge && (
            <Link
              href={`/curriculum/week/${challenge.weekNumber}/challenge/${nextChallenge.id}`}
              className="px-2 py-1 text-[11px] text-[#808080] transition hover:text-[#FFC517]"
            >
              next <ChevronRight size={12} className="inline" />
            </Link>
          )}
        </div>
      </div>

      {/* Main split pane */}
      <div ref={containerRef} className="flex flex-1 overflow-hidden">
        {/* Left panel — Tabbed (Description / Result / Submissions / Solutions) */}
        <div style={{ width: panelWidth }} className="shrink-0 flex flex-col overflow-hidden border-r border-[#1a1a1a] bg-[#0A0A0A]">
          {/* Tab bar */}
          <div className="flex border-b border-[#1a1a1a] bg-[#0D0D0D]">
            {leftTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setLeftTab(tab.key)}
                className={`relative flex items-center gap-1.5 px-3 py-2.5 text-[11px] font-medium whitespace-nowrap transition ${
                  leftTab === tab.key ? "text-[#FFFFFF]" : "text-[#808080] hover:text-[#C8C8C8]"
                }`}
              >
                {tab.icon}
                {tab.label}
                {tab.key === "result" && results && (
                  <span className={`ml-1 text-[9px] ${results.every(r => r.passed) ? "text-emerald-400" : "text-[#C8C8C8]"}`}>
                    ({results.filter(r => r.passed).length}/{results.length})
                  </span>
                )}
                {tab.key === "submissions" && submissions.length > 0 && (
                  <span className="ml-1 text-[9px] text-[#808080]">({submissions.length})</span>
                )}
                {leftTab === tab.key && (
                  <span className="absolute bottom-0 left-2 right-2 h-px bg-[#FFC517] shadow-[0_0_4px_rgba(255,197,23,0.3)]" />
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto">
            {/* ── DESCRIPTION TAB ── */}
            {leftTab === "description" && (
              <div className="p-5 space-y-5">
                <p className="text-[13px] leading-[1.75] text-[#C8C8C8]">{challenge.description}</p>

                <div>
                  <h2 className="section-label mb-3">// INSTRUCTIONS</h2>
                  <ol className="space-y-1">
                    {challenge.instructions.map((inst, i) => (
                      <li key={i} className="flex items-start gap-2.5 border border-[#1a1a1a] bg-[#111111] px-3 py-2.5 text-[12px] text-[#C8C8C8]">
                        <span className="text-[#FFC517] shrink-0">{String(i + 1).padStart(2, "0")}.</span>
                        {inst}
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Hints */}
                <div>
                  <button
                    onClick={() => setShowHints(!showHints)}
                    className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-[#808080] transition hover:text-[#FFC517]"
                  >
                    <Lightbulb size={12} className={showHints ? "text-[#FFC517]" : ""} />
                    {showHints ? "hide_hints" : "show_hints"}
                  </button>
                  <div className={`overflow-hidden transition-all duration-200 ${showHints ? "mt-2 max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                    <div className="space-y-1">
                      {challenge.hints.map((hint, i) => (
                        <div key={i} className="border-l-2 border-[#FFC517]/30 bg-[#FFC517]/[0.03] px-3 py-2 text-[11px] text-[#C8C8C8]">
                          <span className="text-[#FFC517]/70">hint_{i + 1}:</span> {hint}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Score summary if results exist */}
                {results && (
                  <div className="border border-[#1a1a1a] bg-[#111111] p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-[#808080] uppercase tracking-wider">score</span>
                      <div className="flex items-center gap-2">
                        <div className="h-1 w-20 bg-[#1a1a1a] overflow-hidden">
                          <div
                            className="h-full transition-all duration-500"
                            style={{
                              width: `${(score / maxScore) * 100}%`,
                              background: score === maxScore ? "#FFC517" : "#C8C8C8",
                            }}
                          />
                        </div>
                        <span className={`text-[13px] font-semibold tabular-nums ${score === maxScore ? "text-[#FFC517]" : "text-[#C8C8C8]"}`}>
                          {score}/{maxScore}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── RESULT TAB ── */}
            {leftTab === "result" && (
              <div className="flex h-full flex-col">
                {isRunning ? (
                  <div className="flex flex-1 items-center justify-center text-[#808080]">
                    <span className="text-[12px] animate-pulse">running tests...</span>
                  </div>
                ) : !results ? (
                  <div className="flex flex-1 items-center justify-center text-[#5A5A5A]">
                    <span className="text-[12px]">&gt; click &quot;run tests&quot; to see results</span>
                  </div>
                ) : (
                  <>
                    {/* Summary bar */}
                    <div className="flex items-center justify-between border-b border-[#1a1a1a] px-5 py-3">
                      <span className={`text-[13px] font-semibold ${results.every(r => r.passed) ? "text-emerald-400" : "text-[#C8C8C8]"}`}>
                        {results.filter(r => r.passed).length}/{results.length} tests passed
                      </span>
                      <span className={`text-[13px] font-bold tabular-nums ${score === maxScore ? "text-[#FFC517]" : "text-[#C8C8C8]"}`}>
                        {score}/{maxScore} pts
                      </span>
                    </div>

                    {/* Test results */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
                      {results.map((r, i) => (
                        <div
                          key={i}
                          className={`flex items-start gap-2.5 px-4 py-3 text-[12px] border ${
                            r.passed
                              ? "border-emerald-500/10 bg-emerald-500/[0.03] text-emerald-400"
                              : "border-red-500/10 bg-red-500/[0.03] text-red-400"
                          }`}
                        >
                          {r.passed ? <CheckCircle size={13} className="mt-0.5 shrink-0" /> : <XCircle size={13} className="mt-0.5 shrink-0" />}
                          <div>
                            <span className="font-medium">{r.passed ? "PASS" : "FAIL"}</span>
                            <span className="ml-2 text-[#C8C8C8]">{r.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Log output */}
                    <div className="border-t border-[#1a1a1a] px-5 py-3">
                      <span className="text-[10px] uppercase tracking-widest text-[#808080]">log output</span>
                      <div className="mt-2 text-[11px] text-[#808080] font-mono">
                        {results.every(r => r.passed) ? (
                          <div className="text-[#FFC517]">&gt; All validation checks passed. Challenge complete!</div>
                        ) : (
                          <div className="text-[#FF4444]">&gt; {results.filter(r => !r.passed).length} check(s) failed. Review the requirements above.</div>
                        )}
                      </div>
                    </div>

                    {/* Success banner */}
                    {results.every(r => r.passed) && (
                      <div className="border-t border-[#FFC517]/20 bg-[#FFC517]/[0.05] px-5 py-3 flex items-center gap-3">
                        <CheckCircle size={14} className="text-[#FFC517]" />
                        <span className="text-[#FFC517] font-bold text-[13px]">ALL TESTS PASSED</span>
                        <span className="text-[11px] text-[#808080]">{score} points earned</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* ── SUBMISSIONS TAB ── */}
            {leftTab === "submissions" && (
              <div className="p-5">
                {submissions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <History size={24} className="mb-3 text-[#5A5A5A]" />
                    <span className="text-[13px] text-[#808080]">No submissions yet</span>
                    <span className="mt-1 text-[11px] text-[#5A5A5A]">Run tests to create your first submission</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h2 className="section-label mb-3">// SUBMISSION_HISTORY</h2>
                    {submissions.map((sub, i) => {
                      const date = new Date(sub.timestamp);
                      return (
                        <div
                          key={i}
                          className={`border px-4 py-3 ${
                            sub.allPassed
                              ? "border-emerald-500/15 bg-emerald-500/[0.03]"
                              : "border-[#1a1a1a] bg-[#111111]"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {sub.allPassed ? (
                                <CheckCircle size={12} className="text-emerald-400" />
                              ) : (
                                <XCircle size={12} className="text-red-400/60" />
                              )}
                              <span className={`text-[12px] font-semibold ${sub.allPassed ? "text-emerald-400" : "text-[#C8C8C8]"}`}>
                                {sub.allPassed ? "Accepted" : "Failed"}
                              </span>
                            </div>
                            <span className={`text-[12px] font-bold tabular-nums ${sub.allPassed ? "text-[#FFC517]" : "text-[#808080]"}`}>
                              {sub.score}/{sub.maxScore}
                            </span>
                          </div>
                          <div className="mt-1.5 flex items-center gap-3 text-[10px] text-[#808080]">
                            <span className="flex items-center gap-1">
                              <Clock size={9} />
                              {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                            <span>{sub.passed}/{sub.total} tests</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── SOLUTIONS TAB ── */}
            {leftTab === "solutions" && (
              <div className="p-5 space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="section-label">// REFERENCE_SOLUTION</h2>
                    <button
                      onClick={() => setShowSolution(!showSolution)}
                      className="flex items-center gap-1.5 text-[11px] text-[#808080] transition hover:text-[#FFC517]"
                    >
                      {showSolution ? <EyeOff size={11} /> : <Eye size={11} />}
                      {showSolution ? "hide" : "reveal"}
                    </button>
                  </div>

                  {!showSolution ? (
                    <div className="flex flex-col items-center justify-center border border-[#1a1a1a] bg-[#111111] py-12 text-center">
                      <Eye size={20} className="mb-3 text-[#5A5A5A]" />
                      <span className="text-[12px] text-[#808080]">Solution is hidden</span>
                      <span className="mt-1 text-[11px] text-[#5A5A5A]">Try solving it yourself first!</span>
                      <button
                        onClick={() => setShowSolution(true)}
                        className="mt-4 flex items-center gap-1.5 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#808080] border border-[#1a1a1a] transition hover:border-[#FFC517]/30 hover:text-[#FFC517]"
                      >
                        <Eye size={11} />
                        reveal solution
                      </button>
                    </div>
                  ) : (
                    <div className="t-card-window">
                      <div className="t-titlebar flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="t-dot red" />
                          <span className="t-dot yellow" />
                          <span className="t-dot green" />
                          <span className="ml-2 text-[10px] text-[#808080]">solution.sol</span>
                        </div>
                        <span className="text-[9px] uppercase tracking-wider text-[#5A5A5A]">solidity</span>
                      </div>
                      <pre className="!border-0 !bg-transparent p-4 text-[11px] leading-[1.8] text-[#C8C8C8] overflow-x-auto">
                        <code>{challenge.solutionCode}</code>
                      </pre>
                    </div>
                  )}
                </div>

                {/* Community-style info */}
                <div className="border border-[#1a1a1a] bg-[#111111] px-4 py-3">
                  <span className="text-[11px] text-[#808080]">
                    Community solutions coming soon. For now, compare your approach with the reference solution above.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Resize handle */}
        <div
          onMouseDown={() => {
            isDragging.current = true;
            document.body.style.cursor = "col-resize";
            document.body.style.userSelect = "none";
          }}
          className="w-1 shrink-0 cursor-col-resize bg-[#1a1a1a] hover:bg-[#FFC517]/40 active:bg-[#FFC517]/60 transition-colors"
        />

        {/* Right panel — Editor + Actions */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Editor tabs + actions */}
          <div className="flex items-center justify-between border-b border-[#1a1a1a] bg-[#0D0D0D] px-2">
            <div className="flex">
              <button
                onClick={() => setEditorTab("solution")}
                className={`relative flex items-center gap-1.5 px-4 py-2.5 text-[11px] uppercase tracking-wider font-medium transition ${
                  editorTab === "solution" ? "text-[#FFFFFF]" : "text-[#808080] hover:text-[#C8C8C8]"
                }`}
              >
                solution.sol
                {editorTab === "solution" && (
                  <span className="absolute bottom-0 left-2 right-2 h-px bg-[#FFC517] shadow-[0_0_4px_rgba(255,197,23,0.3)]" />
                )}
              </button>
              <button
                onClick={() => setEditorTab("tests")}
                className={`relative flex items-center gap-1.5 px-4 py-2.5 text-[11px] uppercase tracking-wider font-medium transition ${
                  editorTab === "tests" ? "text-[#FFFFFF]" : "text-[#808080] hover:text-[#C8C8C8]"
                }`}
              >
                tests.sol
                {editorTab === "tests" && (
                  <span className="absolute bottom-0 left-2 right-2 h-px bg-[#FFC517] shadow-[0_0_4px_rgba(255,197,23,0.3)]" />
                )}
              </button>
            </div>
            <div className="flex items-center gap-2 pr-2">
              <button
                onClick={resetCode}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] text-[#808080] transition hover:text-[#E0E0E0]"
              >
                <RotateCcw size={11} />
                reset
              </button>
              <button
                onClick={runTests}
                disabled={isRunning}
                className="flex items-center gap-1.5 bg-[#FFC517] px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#000000] transition hover:bg-white hover:shadow-[0_0_12px_rgba(255,197,23,0.15)] disabled:opacity-50"
              >
                {isRunning ? (
                  <span className="animate-pulse">running...</span>
                ) : (
                  <>
                    <Play size={11} />
                    run tests
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Editor area — full height, no separate output panel */}
          <div className="flex-1 overflow-hidden">
            {editorTab === "solution" ? (
              <CodeEditor value={code} onChange={setCode} />
            ) : (
              <CodeEditor value={challenge.testCode} onChange={() => {}} readOnly />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
