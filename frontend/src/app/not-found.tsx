import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto text-center rounded-2xl border border-gray-200 bg-white p-8 shadow-xs">
        <p className="text-xs font-bold uppercase tracking-wider text-teal-700 mb-2">404</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy trang</h1>
        <p className="text-sm text-gray-600 mb-6">Trang bạn tìm không tồn tại hoặc đã bị di chuyển.</p>
        <Link
          className="inline-flex items-center justify-center rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-teal-800 transition-colors"
          href="/"
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
