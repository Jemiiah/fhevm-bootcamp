import { notFound } from "next/navigation";
import { getWeek } from "@/lib/curriculum";
import { WeekDetail } from "@/components/WeekDetail";

export function generateStaticParams() {
  return [{ number: "1" }, { number: "2" }, { number: "3" }, { number: "4" }];
}

export async function generateMetadata({ params }: { params: Promise<{ number: string }> }) {
  const { number } = await params;
  const week = getWeek(Number(number));
  if (!week) {
    return { title: "Week Not Found | FHEVM Bootcamp" };
  }
  return {
    title: `Week ${week.number}: ${week.title} | FHEVM Bootcamp`,
    description: week.overview,
  };
}

export default async function WeekPage({ params }: { params: Promise<{ number: string }> }) {
  const { number } = await params;
  const weekNumber = Number(number);
  const week = getWeek(weekNumber);

  if (!week) {
    notFound();
  }

  return <WeekDetail week={week} />;
}
