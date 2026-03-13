"use client";

import { useEffect, useRef, useState } from "react";

const GLITCH_CHARS = "█▓░╔╗╚╝║═│┤├┬┴┼▲▼◆●■□▪▫◇◈⬡⬢@#$%&*";

interface TerminalTextProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  delay?: number;
  speed?: number;
  trigger?: boolean;
}

export function TerminalText({
  text,
  as: Tag = "span",
  className = "",
  delay = 0,
  speed = 30,
  trigger,
}: TerminalTextProps) {
  const [displayText, setDisplayText] = useState("");
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (trigger === false) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [trigger, started]);

  useEffect(() => {
    if (!started) return;

    const timeout = setTimeout(() => {
      let currentIndex = 0;
      const chars = text.split("");
      const revealed = new Array(chars.length).fill(false);

      const interval = setInterval(() => {
        if (currentIndex >= chars.length) {
          setDisplayText(text);
          setDone(true);
          clearInterval(interval);
          return;
        }

        // Reveal next character
        revealed[currentIndex] = true;
        currentIndex++;

        // Build display string
        const display = chars
          .map((char, i) => {
            if (revealed[i]) return char;
            if (char === " ") return " ";
            return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          })
          .join("");

        setDisplayText(display);
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [started, text, delay, speed]);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={className}
      aria-label={text}
    >
      {displayText || text.replace(/./g, " ")}
      {!done && started && <span className="cursor-blink" />}
    </Tag>
  );
}
