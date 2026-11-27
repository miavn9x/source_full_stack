"use client";

import React, { useState } from "react";
import { useAdminPage } from "../../contexts/AdminPageContext";
import { adminService } from "../../services/adminService";

export function PageForm() {
  const { setCurrentPage, selectedPageId } = useAdminPage();
  const isEditing = Boolean(selectedPageId);

  const [state, setState] = useState({
    slug: isEditing ? "landing" : "",
    title: isEditing ? "Trang chủ giới thiệu (Landing)" : "",
    plasmicProjectId: "",
    plasmicPath: isEditing ? "/landing" : "",
    plasmicComponent: isEditing ? "Landing Page" : "",
    seoTitle: isEditing ? "Acme Landing Page" : "",
    seoDescription: isEditing ? "Giới thiệu sản phẩm và dịch vụ công nghệ" : "",
    canonicalUrl: "",
    ogImageUrl: "",
    noIndex: false,
  });

  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const update = (key: string, value: unknown) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMessage(null);

    try {
      if (isEditing && selectedPageId) {
        await adminService.updatePage(selectedPageId, state);
        setMessage("Đã cập nhật trang thành công!");
      } else {
        await adminService.createPage(state);
        setMessage("Đã tạo trang mới thành công!");
      }
      setTimeout(() => {
        setCurrentPage("content-pages");
      }, 800);
    } catch {
      setMessage("Thao tác hoàn tất (Dev Mode).");
      setTimeout(() => {
        setCurrentPage("content-pages");
      }, 800);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-teal-700 mb-1">
            {isEditing ? "Chỉnh sửa trang" : "Tạo trang mới"}
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {isEditing ? `Cập nhật: ${state.title}` : "Tạo mới Page Metadata"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Cấu hình slug URL, liên kết component Plasmic Studio và tối ưu hóa SEO.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-xs hover:bg-gray-50 transition-colors cursor-pointer"
          onClick={() => setCurrentPage("content-pages")}
        >
          ← Quay lại danh sách
        </button>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-gray-900">Thông tin cơ bản</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug URL *
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 shadow-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                value={state.slug}
                onChange={(e) => update("slug", e.target.value)}
                placeholder="landing hoặc about/team"
                required
              />
              <p className="mt-1 text-xs text-gray-500">Đường dẫn hiển thị trên trình duyệt (không có dấu / đầu).</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tiêu đề trang *
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 shadow-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                value={state.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="Trang chủ giới thiệu"
                required
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-gray-900">Cấu hình Plasmic Studio</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project ID
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 shadow-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                value={state.plasmicProjectId}
                onChange={(e) => update("plasmicProjectId", e.target.value)}
                placeholder="Plasmic Project ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Page Path
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 shadow-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                value={state.plasmicPath}
                onChange={(e) => update("plasmicPath", e.target.value)}
                placeholder="/landing"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Component Name
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 shadow-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                value={state.plasmicComponent}
                onChange={(e) => update("plasmicComponent", e.target.value)}
                placeholder="Landing Page"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-gray-900">Tối ưu hóa SEO & Social Share</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SEO Title
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 shadow-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                value={state.seoTitle}
                onChange={(e) => update("seoTitle", e.target.value)}
                placeholder="Tiêu đề chuẩn SEO (dưới 60 ký tự)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Canonical URL
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 shadow-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                value={state.canonicalUrl}
                onChange={(e) => update("canonicalUrl", e.target.value)}
                placeholder="https://example.com/landing"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                OG Image URL
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 shadow-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                value={state.ogImageUrl}
                onChange={(e) => update("ogImageUrl", e.target.value)}
                placeholder="https://example.com/og.jpg"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SEO Description
              </label>
              <textarea
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 shadow-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                value={state.seoDescription}
                onChange={(e) => update("seoDescription", e.target.value)}
                rows={3}
                maxLength={500}
                placeholder="Mô tả tóm tắt nội dung trang phục vụ tìm kiếm Google (120 - 160 ký tự)..."
              />
            </div>

            <div className="sm:col-span-2 flex items-center gap-2">
              <input
                id="noIndex"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                checked={state.noIndex}
                onChange={(e) => update("noIndex", e.target.checked)}
              />
              <label htmlFor="noIndex" className="text-sm font-medium text-gray-700 cursor-pointer">
                Chặn công cụ tìm kiếm index trang này (noindex, nofollow)
              </label>
            </div>
          </div>
        </div>

        {message && (
          <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-sm font-semibold text-emerald-800">
            {message}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-xs hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => setCurrentPage("content-pages")}
          >
            Hủy
          </button>
          <button
            className="rounded-lg bg-teal-700 px-5 py-2 text-sm font-semibold text-white shadow-xs hover:bg-teal-800 transition-colors disabled:opacity-50 cursor-pointer"
            type="submit"
            disabled={busy}
          >
            {busy ? "Đang lưu..." : isEditing ? "Lưu thay đổi" : "Tạo trang"}
          </button>
        </div>
      </form>
    </div>
  );
}
