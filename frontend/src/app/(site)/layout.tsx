export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 antialiased">
      <main className="flex-1 w-full">{children}</main>
    </div>
  );
}
