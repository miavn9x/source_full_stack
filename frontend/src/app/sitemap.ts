import type { MetadataRoute } from "next";
import { fetchPublishedPages } from "@/features/client";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await fetchPublishedPages();

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...pages.map((page) => ({
      url: `${siteUrl}/${page.slug}`,
      lastModified: page.updatedAt ? new Date(page.updatedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
