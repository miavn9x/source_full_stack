import type { ReactNode } from "react";

const STYLES = {
  1: "text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mb-3",
  2: "text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 mb-2",
  3: "text-lg sm:text-xl font-semibold text-gray-900 mb-2",
} as const;

const TAGS = {
  1: "h1",
  2: "h2",
  3: "h3",
} as const;

export function Heading({
  level = 2,
  className = "",
  children,
}: {
  level?: 1 | 2 | 3;
  className?: string;
  children: ReactNode;
}) {
  const Tag = TAGS[level];

  return <Tag className={`${STYLES[level]} ${className}`}>{children}</Tag>;
}
