"use client";

import React from "react";

export function SettingsManager() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-teal-700 mb-1">
            Cấu hình
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Cài đặt Hệ thống
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Thông tin kết nối Plasmic Self-host, NestJS API Gateway và On-demand ISR.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs divide-y divide-gray-100">
        <div className="pb-4">
          <h3 className="text-base font-bold text-gray-900">Plasmic Studio Host</h3>
          <p className="text-sm text-gray-500 my-1">
            URL máy chủ Plasmic self-hosted trên VPS.
          </p>
          <code className="inline-block rounded-md bg-gray-100 px-2.5 py-1 font-mono text-xs text-teal-700">
            {process.env.NEXT_PUBLIC_PLASMIC_HOST || "http://localhost:3003"}
          </code>
        </div>

        <div className="py-4">
          <h3 className="text-base font-bold text-gray-900">NestJS API URL</h3>
          <p className="text-sm text-gray-500 my-1">
            URL của Backend API Gateway.
          </p>
          <code className="inline-block rounded-md bg-gray-100 px-2.5 py-1 font-mono text-xs text-teal-700">
            {process.env.NEST_API_URL || "http://127.0.0.1:4000"}
          </code>
        </div>

        <div className="pt-4">
          <h3 className="text-base font-bold text-gray-900">Plasmic Canvas Host Path</h3>
          <p className="text-sm text-gray-500 my-1">
            Đường dẫn mà Plasmic Studio sẽ load component preview từ ứng dụng này.
          </p>
          <code className="inline-block rounded-md bg-gray-100 px-2.5 py-1 font-mono text-xs text-teal-700">
            /plasmic-host
          </code>
        </div>
      </div>
    </div>
  );
}
