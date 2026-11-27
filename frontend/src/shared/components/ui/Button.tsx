import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "secondary" | "danger";
  children: ReactNode;
};

const VARIANT_STYLES: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-teal-700 hover:bg-teal-800 text-white shadow-xs focus-visible:ring-teal-500",
  secondary:
    "bg-slate-900 hover:bg-slate-800 text-white shadow-xs focus-visible:ring-slate-500",
  ghost:
    "bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 shadow-xs focus-visible:ring-gray-300",
  danger:
    "bg-red-600 hover:bg-red-700 text-white shadow-xs focus-visible:ring-red-500",
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center font-semibold rounded-lg text-sm px-4 py-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer ${VARIANT_STYLES[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
