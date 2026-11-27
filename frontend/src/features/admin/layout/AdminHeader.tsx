"use client";

import React from "react";
import { AdminLogoutButton } from "./AdminLogoutButton";

export function AdminHeader({
  userName = "Admin User",
}: {
  userName?: string;
}) {
  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-xs">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
          Enterprise CRM
        </p>
        <strong className="text-sm font-semibold text-gray-800">{userName}</strong>
      </div>
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
          Dev Bypass Active
        </span>
        <AdminLogoutButton />
      </div>
    </header>
  );
}
