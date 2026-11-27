"use client";

import React, { useEffect, useState } from "react";
import { adminService } from "../../services/adminService";
import type { AdminUser } from "../../types/admin.types";

export function UserList() {
  const [users, setUsers] = useState<AdminUser[]>([]);

  useEffect(() => {
    adminService.listUsers().then(setUsers);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-teal-700 mb-1">
            Bảo mật & Tài khoản
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Người dùng & Phân quyền (RBAC)
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Quản trị viên, biên tập viên và quyền hạn truy cập API NestJS.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-teal-800 transition-colors cursor-pointer"
        >
          + Mời người dùng
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
              <tr>
                <th className="py-3.5 px-4 text-left">Họ tên</th>
                <th className="py-3.5 px-4 text-left">Email</th>
                <th className="py-3.5 px-4 text-left">Vai trò (Roles)</th>
                <th className="py-3.5 px-4 text-left">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-gray-900">{u.name}</td>
                  <td className="py-3.5 px-4 text-gray-600">{u.email}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1.5">
                      {u.roles.map((r) => (
                        <span
                          key={r}
                          className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 border border-indigo-200"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                      {u.status}
                    </span>
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
