import type {
  AdminPage,
  CreatePageInput,
  PageListResponse,
  UpdatePageInput,
  AdminUser,
  AuditLogItem,
} from "../types/admin.types";

export class AdminClientError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "AdminClientError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api/admin${path}`, {
      ...init,
      headers: {
        accept: "application/json",
        ...(init?.headers ?? {}),
      },
    });
  } catch {
    throw new AdminClientError("Không kết nối được server admin", 502);
  }

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as
      | { message?: unknown }
      | null;
    const message =
      typeof body?.message === "string"
        ? body.message
        : `Admin request failed (${response.status})`;
    throw new AdminClientError(message, response.status);
  }

  return (await response.json()) as T;
}

export const adminService = {
  async listPages(params: {
    status?: string;
    q?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<PageListResponse> {
    const query = new URLSearchParams();
    if (params.status) query.set("status", params.status);
    if (params.q) query.set("q", params.q);
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));

    const qs = query.toString();
    try {
      return await request<PageListResponse>(`/pages${qs ? `?${qs}` : ""}`);
    } catch {
      // Mock fallback for local dev when backend is not running
      return {
        data: [
          {
            id: "page-1",
            slug: "landing",
            title: "Trang chủ giới thiệu (Landing)",
            status: "PUBLISHED",
            plasmicProjectId: "plasmic-demo",
            plasmicPath: "/landing",
            plasmicComponent: "Landing Page",
            seoTitle: "Acme Landing Page",
            seoDescription: "Giới thiệu sản phẩm và dịch vụ công nghệ",
            canonicalUrl: "http://localhost:3000/landing",
            ogImageUrl: "/images/og-default.jpg",
            noIndex: false,
            publishedAt: new Date().toISOString(),
            createdById: "admin-1",
            updatedById: "admin-1",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "page-2",
            slug: "about",
            title: "Về chúng tôi (About Us)",
            status: "DRAFT",
            plasmicProjectId: "plasmic-demo",
            plasmicPath: "/about",
            plasmicComponent: "About Page",
            seoTitle: "Về Acme Corp",
            seoDescription: "Thông tin lịch sử và tầm nhìn công ty",
            canonicalUrl: "http://localhost:3000/about",
            ogImageUrl: null,
            noIndex: false,
            publishedAt: null,
            createdById: "admin-1",
            updatedById: "admin-1",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        meta: { page: 1, limit: 10, total: 2 },
      };
    }
  },

  async getPage(id: string): Promise<AdminPage> {
    return request<AdminPage>(`/pages/${id}`);
  },

  async createPage(input: CreatePageInput): Promise<AdminPage> {
    return request<AdminPage>("/pages", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(input),
    });
  },

  async updatePage(id: string, input: UpdatePageInput): Promise<AdminPage> {
    return request<AdminPage>(`/pages/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(input),
    });
  },

  async deletePage(id: string): Promise<void> {
    await request<void>(`/pages/${id}`, { method: "DELETE" });
  },

  async publishPage(id: string): Promise<AdminPage> {
    return request<AdminPage>(`/pages/${id}/publish`, { method: "POST" });
  },

  async unpublishPage(id: string): Promise<AdminPage> {
    return request<AdminPage>(`/pages/${id}/unpublish`, { method: "POST" });
  },

  async revalidate(paths: string[]): Promise<void> {
    await fetch("/api/revalidate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ paths }),
    });
  },

  async listUsers(): Promise<AdminUser[]> {
    return [
      {
        id: "usr-1",
        email: "admin@example.com",
        name: "Quản trị viên chính",
        roles: ["admin", "superadmin"],
        status: "ACTIVE",
        createdAt: new Date().toISOString(),
      },
      {
        id: "usr-2",
        email: "editor@example.com",
        name: "Biên tập viên",
        roles: ["editor"],
        status: "ACTIVE",
        createdAt: new Date().toISOString(),
      },
    ];
  },

  async listAuditLogs(): Promise<AuditLogItem[]> {
    return [
      {
        id: "log-1",
        actorId: "admin-1",
        action: "PAGE_PUBLISH",
        entityType: "Page",
        entityId: "page-1",
        createdAt: new Date().toISOString(),
      },
      {
        id: "log-2",
        actorId: "admin-1",
        action: "PAGE_CREATE",
        entityType: "Page",
        entityId: "page-2",
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
    ];
  },
};
