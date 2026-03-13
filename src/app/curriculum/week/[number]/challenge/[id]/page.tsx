"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { getChallenge, getChallengesForWeek } from "@/lib/challenges";
import { ChallengeLayout } from "@/components/ChallengeLayout";

export default function ChallengePage() {
  const params = useParams<{ number: string; id: string }>();
  const weekNumber = Number(params.number);
  const challenge = getChallenge(params.id);
  const weekChallenges = getChallengesForWeek(weekNumber);

  if (!challenge) {
    return (
      <div className="mx-auto max-w-4xl px-6 pt-28 pb-20 text-center">
        <h1 className="text-2xl font-bold text-white">Challenge not found</h1>
        <Link
          href={`/curriculum/week/${weekNumber}`}
          className="mt-4 inline-block text-[14px] text-neutral-500 hover:text-white"
        >
          &larr; Back to Week {weekNumber}
        </Link>
      </div>
    );
  }

  const currentIndex = weekChallenges.findIndex((c) => c.id === challenge.id);
  const prev = currentIndex > 0 ? weekChallenges[currentIndex - 1] : undefined;
  const next = currentIndex < weekChallenges.length - 1 ? weekChallenges[currentIndex + 1] : undefined;

  return (
    <ChallengeLayout
      challenge={challenge}
      prevChallenge={prev ? { id: prev.id, title: prev.title } : undefined}
      nextChallenge={next ? { id: next.id, title: next.title } : undefined}
    />
  );
}
