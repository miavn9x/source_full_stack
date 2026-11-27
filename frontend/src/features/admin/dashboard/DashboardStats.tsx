"use client";

import React, { useEffect, useState } from "react";
import { useAdminPage } from "../contexts/AdminPageContext";
import { adminService } from "../services/adminService";
import type { PageListResponse } from "../types/admin.types";

export function DashboardStats() {
  const { setCurrentPage } = useAdminPage();
  const [data, setData] = useState<PageListResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .listPages()
      .then((res) => setData(res))
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  const total = data?.meta.total ?? 0;
  const published =
    data?.data.filter((p) => p.status === "PUBLISHED").length ?? 0;
  const drafts = total - published;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-teal-700 mb-1">
            Tổng quan hệ thống
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Bàn làm việc Quản trị (CRM)
          </h1>
          <p className="text-sm text-gray-500 mt-1 max-w-2xl">
            Quản lý nội dung Plasmic CMS, SEO metadata, phân quyền và dữ liệu
            khách hàng theo kiến trúc Microservices-ready với 100% Tailwind CSS 4.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-teal-800 transition-colors cursor-pointer"
          onClick={() => setCurrentPage("content-page-new")}
        >
          + Tạo page metadata
        </button>
      </div>

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <article className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <span className="text-sm font-medium text-gray-500">Tổng số page</span>
          <strong className="text-3xl font-black text-gray-900 mt-2">
            {loading ? "..." : total}
          </strong>
        </article>

        <article className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <span className="text-sm font-medium text-emerald-600">Đã xuất bản (Published)</span>
          <strong className="text-3xl font-black text-emerald-700 mt-2">
            {loading ? "..." : published}
          </strong>
        </article>

        <article className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <span className="text-sm font-medium text-amber-600">Bản nháp (Drafts)</span>
          <strong className="text-3xl font-black text-amber-700 mt-2">
            {loading ? "..." : drafts}
          </strong>
        </article>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Trang nội dung gần đây</h2>
          <button
            type="button"
            className="text-sm font-semibold text-teal-700 hover:text-teal-800 cursor-pointer"
            onClick={() => setCurrentPage("content-pages")}
          >
            Xem toàn bộ →
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-gray-500 py-4 text-center">Đang tải dữ liệu...</p>
        ) : data?.data && data.data.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                <tr>
                  <th className="py-3 px-4 text-left">Tiêu đề</th>
                  <th className="py-3 px-4 text-left">Slug</th>
                  <th className="py-3 px-4 text-left">Trạng thái</th>
                  <th className="py-3 px-4 text-left">Cập nhật</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.data.slice(0, 5).map((page) => (
                  <tr key={page.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-900">{page.title}</td>
                    <td className="py-3 px-4 text-gray-500 font-mono text-xs">{page.slug}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          page.status === "PUBLISHED"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {page.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-xs">
                      {new Date(page.updatedAt).toLocaleDateString("vi-VN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-500 py-4 text-center">
            Chưa có trang nào. Nhấn &quot;+ Tạo page metadata&quot; để thêm.
          </p>
        )}
      </section>
    </div>
  );
}
