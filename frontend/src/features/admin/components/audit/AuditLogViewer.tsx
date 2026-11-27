"use client";

import React, { useEffect, useState } from "react";
import { adminService } from "../../services/adminService";
import type { AuditLogItem } from "../../types/admin.types";

export function AuditLogViewer() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);

  useEffect(() => {
    adminService.listAuditLogs().then(setLogs);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-teal-700 mb-1">
            Giám sát & Tuân thủ
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Lịch sử Thao tác (Audit Log)
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Theo dõi mọi hành động sửa đổi, xuất bản nội dung và thao tác của quản trị viên.
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
              <tr>
                <th className="py-3.5 px-4 text-left">Thời gian</th>
                <th className="py-3.5 px-4 text-left">Hành động</th>
                <th className="py-3.5 px-4 text-left">Đối tượng</th>
                <th className="py-3.5 px-4 text-left">ID Đối tượng</th>
                <th className="py-3.5 px-4 text-left">Người thực hiện</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-3.5 px-4 text-xs text-gray-500">
                    {new Date(log.createdAt).toLocaleString("vi-VN")}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs font-semibold text-teal-700">
                    {log.action}
                  </td>
                  <td className="py-3.5 px-4 text-gray-800">{log.entityType}</td>
                  <td className="py-3.5 px-4 font-mono text-xs text-gray-500">
                    {log.entityId}
                  </td>
                  <td className="py-3.5 px-4 text-gray-600 font-medium">
                    {log.actorId || "System"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
