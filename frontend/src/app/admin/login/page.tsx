import { LoginForm } from "@/features/auth/components/LoginForm";

export const metadata = {
  title: "Đăng nhập quản trị",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-4">
      <section className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
        <p className="text-xs font-bold uppercase tracking-wider text-teal-700 mb-1">
          Enterprise CRM
        </p>
        <h1 className="text-2xl font-black tracking-tight text-gray-900 mb-2">
          Đăng nhập quản trị
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Quản lý page metadata, SEO, trạng thái publish và mở Plasmic Studio để thiết kế giao diện.
        </p>

        <LoginForm nextPath="/admin" />

        <p className="mt-6 text-center text-xs text-gray-400">
          Chế độ phát triển (Dev): Bạn có thể truy cập thẳng{" "}
          <code className="text-teal-700 font-semibold">/admin</code> mà không cần đăng nhập.
        </p>
      </section>
    </main>
  );
}
