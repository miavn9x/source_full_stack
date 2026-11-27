import type {
  PageRecord,
  PageRevisionRecord,
  PageStatus,
} from './page.js';

export const PAGE_REPOSITORY = Symbol('PAGE_REPOSITORY');

export interface ListPagesInput {
  status?: PageStatus;
  q?: string;
  page: number;
  limit: number;
  publicOnly?: boolean;
}

export interface PageListResult {
  items: PageRecord[];
  total: number;
}

export interface CreatePageInput {
  slug: string;
  title: string;
  plasmicProjectId?: string | null;
  plasmicPath?: string | null;
  plasmicComponent?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  canonicalUrl?: string | null;
  ogImageUrl?: string | null;
  noIndex?: boolean;
  createdById?: string | null;
}

export interface UpdatePageInput {
  slug?: string;
  title?: string;
  status?: PageStatus;
  plasmicProjectId?: string | null;
  plasmicPath?: string | null;
  plasmicComponent?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  canonicalUrl?: string | null;
  ogImageUrl?: string | null;
  noIndex?: boolean;
  publishedAt?: Date | null;
  updatedById?: string | null;
}

export interface PageRepository {
  list(input: ListPagesInput): Promise<PageListResult>;
  findById(id: string): Promise<PageRecord | null>;
  findBySlug(slug: string): Promise<PageRecord | null>;
  findByPlasmic(
    projectId: string,
    path: string,
  ): Promise<PageRecord | null>;
  create(input: CreatePageInput): Promise<PageRecord>;
  update(id: string, input: UpdatePageInput): Promise<PageRecord>;
  remove(id: string): Promise<void>;
  createRevision(
    pageId: string,
    snapshot: unknown,
    createdById?: string | null,
  ): Promise<void>;
  listRevisions(pageId: string): Promise<PageRevisionRecord[]>;
}
