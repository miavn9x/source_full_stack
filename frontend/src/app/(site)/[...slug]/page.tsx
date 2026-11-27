import type { Metadata } from "next";
import {
  fetchPublishedPage,
  fetchPublishedPages,
} from "@/features/client";
import { PlasmicPage } from "@/platform/plasmic/page-renderer";

export const dynamicParams = true;
export const revalidate = 300;

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  const pages = await fetchPublishedPages();
  return pages.map((page) => ({ slug: page.slug.split("/") }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const path = slug.join("/");
  const page = await fetchPublishedPage(path);

  if (!page) {
    return { title: path };
  }

  return {
    title: page.seoTitle ?? page.title,
    description: page.seoDescription ?? undefined,
    alternates: page.canonicalUrl ? { canonical: page.canonicalUrl } : undefined,
    robots: page.noIndex
      ? { index: false, follow: false }
      : undefined,
    openGraph: {
      title: page.seoTitle ?? page.title,
      description: page.seoDescription ?? undefined,
      images: page.ogImageUrl ? [page.ogImageUrl] : undefined,
    },
  };
}

export default async function DynamicSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const path = slug.join("/");
  const page = await fetchPublishedPage(path);

  if (!page) {
    return <PlasmicPage page={{ slug: path, title: path }} />;
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
