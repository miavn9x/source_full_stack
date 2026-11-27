import type { Metadata } from "next";
import { AdminPageProvider } from "@/features/admin/contexts/AdminPageContext";
import { SidebarProvider } from "@/features/admin/contexts/SidebarContext";
import { verifyAdminAccess } from "@/features/admin/lib/admin-guard";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Admin CRM Portal",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const hasAccess = await verifyAdminAccess();

  if (!hasAccess) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 antialiased">
      <AdminPageProvider>
        <SidebarProvider>{children}</SidebarProvider>
      </AdminPageProvider>
    </div>
  );
}
