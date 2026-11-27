"use client";

import React, { useState } from "react";

export interface CrmLeadFormProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  successMessage?: string;
}

export function CrmLeadForm({
  title = "Đăng ký tư vấn & Kết nối CRM",
  subtitle = "Để lại thông tin liên hệ, chuyên viên CRM sẽ hỗ trợ bạn trong vòng 15 phút.",
  buttonText = "Gửi yêu cầu tư vấn",
  successMessage = "Cảm ơn bạn! Thông tin đã được gửi tới hệ thống CRM thành công.",
}: CrmLeadFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    // Simulate sending lead payload to CRM backend
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setStatus("success");
      setFullName("");
      setEmail("");
      setPhone("");
      setCompany("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="w-full py-8">
      <div className="mx-auto max-w-xl rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
        {title && (
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight text-center">
            {title}
          </h3>
        )}
        {subtitle && (
          <p className="mt-2 text-sm text-gray-600 text-center mb-6">
            {subtitle}
          </p>
        )}

        {status === "success" ? (
          <div className="rounded-xl bg-teal-50 border border-teal-200 p-6 text-center">
            <svg
              className="mx-auto h-10 w-10 text-teal-700 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm font-semibold text-teal-900">{successMessage}</p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="mt-4 text-xs font-medium text-teal-700 underline hover:text-teal-800"
            >
              Gửi một yêu cầu khác
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Họ và tên *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nguyễn Văn A"
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-teal-700 focus:ring-1 focus:ring-teal-700 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email làm việc *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@company.com"
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-teal-700 focus:ring-1 focus:ring-teal-700 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Số điện thoại *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0912 345 678"
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-teal-700 focus:ring-1 focus:ring-teal-700 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Tên công ty / Tổ chức
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Công ty Cổ phần ABC"
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-teal-700 focus:ring-1 focus:ring-teal-700 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Nội dung yêu cầu
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Mô tả nhu cầu tích hợp hoặc giải pháp của bạn..."
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-teal-700 focus:ring-1 focus:ring-teal-700 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full inline-flex justify-center items-center rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-teal-800 disabled:opacity-60 transition-colors cursor-pointer"
            >
              {status === "submitting" ? "Đang gửi..." : buttonText}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
