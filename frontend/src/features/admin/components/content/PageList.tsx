"use client";

import React, { useEffect, useState } from "react";
import { useAdminPage } from "../../contexts/AdminPageContext";
import { adminService } from "../../services/adminService";
import type { AdminPage } from "../../types/admin.types";

export function PageList() {
  const { setCurrentPage, setSelectedPageId } = useAdminPage();
  const [pages, setPages] = useState<AdminPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const loadData = () => {
    setLoading(true);
    adminService
      .listPages()
      .then((res) => setPages(res.data))
      .catch(() => null)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    let active = true;
    adminService
      .listPages()
      .then((res) => {
        if (active) setPages(res.data);
      })
      .catch(() => null)
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleEdit = (id: string) => {
    setSelectedPageId(id);
    setCurrentPage("content-page-edit");
  };

  const handleTogglePublish = async (page: AdminPage) => {
    setBusyId(page.id);
    try {
      if (page.status === "PUBLISHED") {
        await adminService.unpublishPage(page.id);
      } else {
        await adminService.publishPage(page.id);
      }
      loadData();
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa page này?")) return;
    setBusyId(id);
    try {
      await adminService.deletePage(id);
      loadData();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-teal-700 mb-1">
            Plasmic CMS
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Quản lý Trang Nội Dung
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Cấu hình metadata, liên kết dự án Plasmic và quản lý trạng thái xuất bản.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-teal-800 transition-colors cursor-pointer"
          onClick={() => {
            setSelectedPageId(null);
            setCurrentPage("content-page-new");
          }}
        >
          + Thêm trang mới
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-sm text-gray-500">Đang tải danh sách trang...</div>
        ) : pages.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-500">
            Chưa có trang nào. Nhấn &quot;+ Thêm trang mới&quot; để tạo.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                <tr>
                  <th className="py-3.5 px-4 text-left">Tiêu đề</th>
                  <th className="py-3.5 px-4 text-left">Slug</th>
                  <th className="py-3.5 px-4 text-left">Component</th>
                  <th className="py-3.5 px-4 text-left">Trạng thái</th>
                  <th className="py-3.5 px-4 text-left">Cập nhật</th>
                  <th className="py-3.5 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pages.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-gray-900">{p.title}</td>
                    <td className="py-3.5 px-4 font-mono text-xs text-gray-600">/{p.slug}</td>
                    <td className="py-3.5 px-4 text-xs text-gray-500">
                      {p.plasmicComponent || "—"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          p.status === "PUBLISHED"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-gray-500">
                      {new Date(p.updatedAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        type="button"
                        className="rounded-md border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 shadow-xs cursor-pointer"
                        onClick={() => handleEdit(p.id)}
                        disabled={busyId === p.id}
                      >
                        Sửa
                      </button>
                      <button
                        type="button"
                        className={`rounded-md px-2.5 py-1 text-xs font-medium shadow-xs cursor-pointer ${
                          p.status === "PUBLISHED"
                            ? "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                        }`}
                        onClick={() => handleTogglePublish(p)}
                        disabled={busyId === p.id}
                      >
                        {p.status === "PUBLISHED" ? "Hạ bản" : "Xuất bản"}
                      </button>
                      <button
                        type="button"
                        className="rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-100 shadow-xs cursor-pointer"
                        onClick={() => handleDelete(p.id)}
                        disabled={busyId === p.id}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
