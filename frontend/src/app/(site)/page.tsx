import type { Metadata } from "next";
import { fetchPublishedPage } from "@/features/client";
import { PlasmicPage } from "@/platform/plasmic/page-renderer";

export const dynamicParams = true;
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchPublishedPage("home");

  if (!page) {
    return {
      title: "Trang chủ",
      description: "Giao diện được hiển thị trực tiếp từ Plasmic Studio kết nối CRM",
    };
  }

  return {
    title: page.seoTitle ?? page.title,
    description: page.seoDescription ?? undefined,
    alternates: page.canonicalUrl ? { canonical: page.canonicalUrl } : undefined,
    robots: page.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: page.seoTitle ?? page.title,
      description: page.seoDescription ?? undefined,
      images: page.ogImageUrl ? [page.ogImageUrl] : undefined,
    },
  };
}

export default async function HomePage() {
  const page = (await fetchPublishedPage("home")) ?? (await fetchPublishedPage("trang-chu"));

  if (!page) {
    return <PlasmicPage page={{ slug: "/", title: "Trang chủ" }} />;
  }

  return (
    <PlasmicPage
      page={{
        slug: page.slug,
        title: page.title,
        plasmicComponent: page.plasmicComponent ?? undefined,
      }}
    />
  );
}
