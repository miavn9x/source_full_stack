"use client";

import React from "react";

export interface StatItem {
  label: string;
  value: string;
  change?: string;
  description?: string;
}

export interface CrmStatsWidgetProps {
  title?: string;
  subtitle?: string;
  stat1Label?: string;
  stat1Value?: string;
  stat2Label?: string;
  stat2Value?: string;
  stat3Label?: string;
  stat3Value?: string;
  stat4Label?: string;
  stat4Value?: string;
}

export function CrmStatsWidget({
  title = "Chỉ số hệ thống CRM",
  subtitle = "Số liệu vận hành và dữ liệu khách hàng được đồng bộ tự động từ CRM Portal",
  stat1Label = "Khách hàng doanh nghiệp",
  stat1Value = "1,250+",
  stat2Label = "Nội dung & Trang xuất bản",
  stat2Value = "480+",
  stat3Label = "Tỉ lệ hài lòng SLA",
  stat3Value = "99.9%",
  stat4Label = "Tốc độ xử lý yêu cầu",
  stat4Value = "< 15m",
}: CrmStatsWidgetProps) {
  const stats: StatItem[] = [
    { label: stat1Label, value: stat1Value },
    { label: stat2Label, value: stat2Value },
    { label: stat3Label, value: stat3Value },
    { label: stat4Label, value: stat4Value },
  ];

  return (
    <section className="w-full py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="mb-8 text-center">
            {title && (
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-2 text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs text-center hover:border-teal-300 transition-colors"
            >
              <p className="text-3xl sm:text-4xl font-extrabold text-teal-700 tracking-tight">
                {stat.value}
              </p>
              <p className="mt-2 text-xs sm:text-sm font-medium text-gray-700">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
