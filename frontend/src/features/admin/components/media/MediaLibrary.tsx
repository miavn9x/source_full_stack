"use client";

import React from "react";

export function MediaLibrary() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-teal-700 mb-1">
            Lưu trữ & CDN
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Thư viện Media
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Quản lý tập tin tải lên S3 / MinIO storage và tối ưu hóa hình ảnh.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-teal-800 transition-colors cursor-pointer"
        >
          + Tải lên file mới
        </button>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs">
        <div className="p-12 text-center border-2 border-dashed border-gray-300 rounded-xl hover:border-teal-400 transition-colors">
          <p className="text-sm text-gray-600 mb-4">
            Kéo thả hình ảnh hoặc video vào đây để tải lên trực tiếp S3 bucket
          </p>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Chọn file từ máy tính
          </button>
        </div>
      </section>
    </div>
  );
}
