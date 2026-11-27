import "server-only";

import { env } from "@/shared/config/env";
import type { ContentPage } from "../types/post.types";

interface PageListResponse {
  data: ContentPage[];
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}

async function request<T>(
  path: string,
  tags: string[],
): Promise<T | null> {
  try {
    const response = await fetch(`${env.NEST_API_URL}/api/v1${path}`, {
      next: {
        revalidate: 300,
        tags,
      },
    });

    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    // Local build should still succeed when backend API is not running
    return null;
  }
}

export async function fetchPublishedPages(): Promise<ContentPage[]> {
  const result = await request<PageListResponse>("/public/pages", ["pages"]);
  return result?.data ?? [];
}

export async function fetchPublishedPage(
  slug: string,
): Promise<ContentPage | null> {
  const normalized = slug.replace(/^\/+|\/+$/g, "");
  return request<ContentPage>(
    `/public/pages/by-slug?slug=${encodeURIComponent(normalized)}`,
    ["pages", `page:${normalized}`],
  );
}

export const postService = {
  fetchPublishedPages,
  fetchPublishedPage,
};
