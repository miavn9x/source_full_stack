"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function LoginForm({ nextPath = "/admin" }: { nextPath?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const body = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!response.ok) {
        setError(body?.error ?? "Đăng nhập thất bại");
        return;
      }

      router.replace(nextPath.startsWith("/admin") ? nextPath : "/admin");
      router.refresh();
    } catch {
      setError("Không kết nối được API đăng nhập");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="space-y-4 w-full" onSubmit={submit}>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Email
        </label>
        <input
          className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 shadow-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Mật khẩu
        </label>
        <input
          className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 shadow-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={8}
        />
      </div>

      {error ? (
        <p className="rounded-lg bg-red-50 p-3 text-xs font-medium text-red-700 border border-red-200">
          {error}
        </p>
      ) : null}

      <button
        className="w-full inline-flex items-center justify-center rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-teal-800 transition-colors disabled:opacity-50 cursor-pointer"
        type="submit"
        disabled={busy}
      >
        {busy ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>
    </form>
  );
}
