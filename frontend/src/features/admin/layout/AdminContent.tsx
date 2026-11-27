"use client";

import React from "react";
import { useAdminPage } from "../contexts/AdminPageContext";
import { DashboardStats } from "../dashboard/DashboardStats";
import { PageList } from "../components/content/PageList";
import { PageForm } from "../components/content/PageForm";
import { MediaLibrary } from "../components/media/MediaLibrary";
import { UserList } from "../components/users/UserList";
import { AuditLogViewer } from "../components/audit/AuditLogViewer";
import { SettingsManager } from "../components/settings/SettingsManager";

export function AdminContent() {
  const { currentPage } = useAdminPage();

  const renderCurrentView = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardStats />;
      case "content-pages":
        return <PageList />;
      case "content-page-new":
      case "content-page-edit":
        return <PageForm />;
      case "media":
        return <MediaLibrary />;
      case "users":
        return <UserList />;
      case "audit":
        return <AuditLogViewer />;
      case "settings":
        return <SettingsManager />;
      default:
        return <DashboardStats />;
    }
  };

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto p-6 lg:p-8">
      {renderCurrentView()}
    </main>
  );
}
