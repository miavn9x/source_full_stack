export type PageStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface PageRecord {
  id: string;
  slug: string;
  title: string;
  status: PageStatus;
  plasmicProjectId: string | null;
  plasmicPath: string | null;
  plasmicComponent: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  canonicalUrl: string | null;
  ogImageUrl: string | null;
  noIndex: boolean;
  publishedAt: Date | null;
  createdById: string | null;
  updatedById: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PublicPage {
  slug: string;
  title: string;
  plasmicComponent: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  canonicalUrl: string | null;
  ogImageUrl: string | null;
  noIndex: boolean;
  publishedAt: Date | null;
  updatedAt: Date;
}

export interface PageRevisionRecord {
  id: string;
  pageId: string;
  snapshot: unknown;
  createdById: string | null;
  createdAt: Date;
}

export function toPublicPage(page: PageRecord): PublicPage {
  return {
    slug: page.slug,
    title: page.title,
    plasmicComponent: page.plasmicComponent,
    seoTitle: page.seoTitle,
    seoDescription: page.seoDescription,
    canonicalUrl: page.canonicalUrl,
    ogImageUrl: page.ogImageUrl,
    noIndex: page.noIndex,
    publishedAt: page.publishedAt,
    updatedAt: page.updatedAt,
  };
}
