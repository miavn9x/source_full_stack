export interface ContentPage {
  id?: string;
  slug: string;
  title: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED" | string;
  plasmicComponent?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  canonicalUrl?: string | null;
  ogImageUrl?: string | null;
  noIndex?: boolean;
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
