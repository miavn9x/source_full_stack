"use client";

import React from "react";
import { useSidebar } from "../contexts/SidebarContext";
import { MenuItems } from "./MenuItems";

export function AdminSidebar() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();

  return (
    <aside
      className={`shrink-0 bg-slate-900 text-slate-100 flex flex-col min-h-screen p-5 transition-all duration-300 ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="text-xl font-black text-white tracking-tight">
          {isSidebarOpen ? (
            <>
              Acme <span className="text-teal-400">CRM</span>
            </>
          ) : (
            <span className="text-teal-400">A</span>
          )}
        </div>
        <button
          type="button"
          onClick={toggleSidebar}
          className="rounded-md bg-slate-800 p-1.5 text-xs text-slate-300 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
          title={isSidebarOpen ? "Thu gọn sidebar" : "Mở rộng sidebar"}
        >
          {isSidebarOpen ? "◀" : "▶"}
        </button>
      </div>

      <MenuItems isSidebarOpen={isSidebarOpen} />
    </aside>
  );
}
