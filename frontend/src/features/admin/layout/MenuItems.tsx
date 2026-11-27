"use client";

import React from "react";
import { useAdminPage } from "../contexts/AdminPageContext";

interface MenuItem {
  id: string;
  label: string;
  page: string;
  short: string;
}

const MENU_ITEMS: MenuItem[] = [
  { id: "dashboard", label: "Tổng quan", page: "dashboard", short: "TQ" },
  { id: "content-pages", label: "Trang nội dung (CMS)", page: "content-pages", short: "CMS" },
  { id: "media", label: "Thư viện Media", page: "media", short: "MED" },
  { id: "users", label: "Người dùng & Phân quyền", page: "users", short: "USR" },
  { id: "audit", label: "Lịch sử thao tác (Audit)", page: "audit", short: "AUD" },
  { id: "settings", label: "Cài đặt hệ thống", page: "settings", short: "SET" },
];

export function MenuItems({ isSidebarOpen }: { isSidebarOpen: boolean }) {
  const { currentPage, setCurrentPage } = useAdminPage();

  return (
    <nav className="flex flex-col space-y-1.5 flex-1" aria-label="Admin navigation">
      {MENU_ITEMS.map((item) => {
        const isActive =
          currentPage === item.page ||
          (item.page === "content-pages" &&
            (currentPage === "content-page-new" ||
              currentPage === "content-page-edit"));

        return (
          <button
            key={item.id}
            type="button"
            className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm transition-colors text-left w-full cursor-pointer ${
              isActive
                ? "bg-teal-600 text-white font-semibold shadow-xs"
                : "text-slate-300 hover:bg-slate-800 hover:text-white font-normal"
            }`}
            onClick={() => setCurrentPage(item.page)}
            title={item.label}
          >
            {isSidebarOpen ? item.label : item.short}
          </button>
        );
      })}

      <div className="mt-auto pt-4 border-t border-slate-800 flex flex-col space-y-1">
        <a
          href="/admin/builder"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors"
          title="Mở Visual Studio Designer"
        >
          {isSidebarOpen ? "🎨 Visual Studio Builder ↗" : "VS"}
        </a>
        <a
          href="/plasmic-host"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          title="Plasmic Canvas Host"
        >
          {isSidebarOpen ? "Plasmic Canvas ↗" : "PH"}
        </a>
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          title="Xem Website Public"
        >
          {isSidebarOpen ? "Xem Website ↗" : "WS"}
        </a>
      </div>
    </nav>
  );
}
