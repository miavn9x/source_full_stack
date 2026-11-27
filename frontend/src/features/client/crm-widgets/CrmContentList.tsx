"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import type { ContentPage } from "../post/types/post.types";

export interface CrmContentListProps {
  title?: string;
  subtitle?: string;
  limit?: number;
  showDate?: boolean;
  layout?: "grid" | "list";
  emptyMessage?: string;
}

const FALLBACK_PAGES: ContentPage[] = [
  {
    id: "fallback-1",
    slug: "gioi-thieu",
    title: "Về chúng tôi & Tầm nhìn phát triển",
    status: "PUBLISHED",
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: "fallback-2",
    slug: "dich-vu-enterprise",
    title: "Giải pháp chuyển đổi số cho Doanh nghiệp Enterprise",
    status: "PUBLISHED",
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: "fallback-3",
    slug: "chinh-sach-bao-mat",
    title: "Chính sách bảo mật và Quy chuẩn vận hành hệ thống",
    status: "PUBLISHED",
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
];

export function CrmContentList({
  title = "Nội dung xuất bản từ CRM",
  subtitle = "Các bài viết, thông báo và tài liệu công khai được quản trị trực tiếp trên CRM Portal",
  limit = 6,
  showDate = true,
  layout = "grid",
  emptyMessage = "Chưa có nội dung nào được xuất bản.",
}: CrmContentListProps) {
  const [pages, setPages] = useState<ContentPage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        const res = await fetch("/api/admin/content/pages?status=PUBLISHED&limit=10");
        if (res.ok) {
          const json = await res.json();
          if (mounted && json?.data?.length > 0) {
            setPages(json.data.slice(0, limit));
            setLoading(false);
            return;
          }
        }
      } catch {
        // Fallback to placeholder if backend API is not connected
      }

      if (mounted) {
        setPages(FALLBACK_PAGES.slice(0, limit));
        setLoading(false);
      }
    }

    loadData();
    return () => {
      mounted = false;
    };
  }, [limit]);

  return (
    <section className="w-full py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="mb-8 text-center sm:text-left">
            {title && (
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-2 text-sm sm:text-base text-gray-600 max-w-2xl">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-44 rounded-xl bg-gray-100 p-6"></div>
            ))}
          </div>
        ) : pages.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
            {emptyMessage}
          </div>
        ) : (
          <div
            className={
              layout === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                : "flex flex-col space-y-4"
            }
          >
            {pages.map((item) => (
              <article
                key={item.id ?? item.slug}
                className="group flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-xs hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-700">
                      CRM Content
                    </span>
                    {showDate && item.publishedAt && (
                      <time className="text-xs text-gray-400">
                        {new Date(item.publishedAt).toLocaleDateString("vi-VN")}
                      </time>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-teal-700 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs font-mono text-gray-400">
                    /{item.slug}
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <Link
                    href={`/${item.slug}`}
                    className="inline-flex items-center text-xs font-semibold text-teal-700 hover:text-teal-800"
                  >
                    Xem chi tiết →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
