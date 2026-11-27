import type { ReactNode } from "react";

export function Text({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={`text-base text-gray-600 leading-relaxed mb-3 ${className}`}>
      {children}
    </p>
  );
}
