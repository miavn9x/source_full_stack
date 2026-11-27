"use client";

import React from "react";
import { AdminHeader } from "./AdminHeader";
import { AdminSidebar } from "./AdminSidebar";
import { AdminContent } from "./AdminContent";

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        <AdminContent />
      </div>
    </div>
  );
}
