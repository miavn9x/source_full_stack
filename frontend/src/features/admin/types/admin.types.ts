export type PageStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface AdminPage {
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
  publishedAt: string | null;
  createdById: string | null;
  updatedById: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PageListResponse {
  data: AdminPage[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface CreatePageInput {
  slug: string;
  title: string;
  plasmicProjectId?: string;
  plasmicPath?: string;
  plasmicComponent?: string;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  ogImageUrl?: string;
  noIndex?: boolean;
}

export type UpdatePageInput = Partial<CreatePageInput>;

export interface PageRevision {
  id: string;
  pageId: string;
  snapshot: unknown;
  createdById: string | null;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  roles: string[];
  status: "ACTIVE" | "DISABLED";
  createdAt: string;
}

export interface AuditLogItem {
  id: string;
  actorId: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  createdAt: string;
}
