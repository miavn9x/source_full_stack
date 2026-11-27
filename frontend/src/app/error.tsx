"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto text-center rounded-2xl border border-gray-200 bg-white p-8 shadow-xs">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Đã có lỗi xảy ra</h1>
        <p className="text-sm text-gray-600 mb-6">Thử lại hoặc liên hệ quản trị viên nếu lỗi tiếp tục.</p>
        <button
          className="inline-flex items-center justify-center rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-teal-800 transition-colors cursor-pointer"
          onClick={reset}
        >
          Thử lại
        </button>
      </div>
    </div>
  );
}
