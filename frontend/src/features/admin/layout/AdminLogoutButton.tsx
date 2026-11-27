"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminLogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function logout() {
    setBusy(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.replace("/admin/login");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-xs hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors disabled:opacity-50 cursor-pointer"
      onClick={logout}
      disabled={busy}
    >
      {busy ? "Đang thoát..." : "Đăng xuất"}
    </button>
  );
}
