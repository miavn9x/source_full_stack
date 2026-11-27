import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuditService } from '../../audit/audit.service.js';
import {
  PAGE_REPOSITORY,
  type CreatePageInput,
  type ListPagesInput,
  type PageRepository,
  type UpdatePageInput,
} from '../domain/page.repository.js';
import type { PageRecord, PublicPage } from '../domain/page.js';
import { toPublicPage } from '../domain/page.js';
import type {
  CreatePageDto,
  ListPagesQueryDto,
  UpdatePageDto,
} from '../presentation/dto/page.dto.js';

function normalizeSlug(raw: string): string {
  const slug = raw.trim().replace(/^\/+|\/+$/g, '').replace(/\/{2,}/g, '/');

  if (!/^[a-z0-9]+(?:[/-][a-z0-9]+)*$/.test(slug)) {
    throw new BadRequestException(
      'slug must contain lowercase letters, numbers, hyphens and slashes only',
    );
  }

  return slug;
}

function snapshotOf(page: PageRecord): unknown {
  return JSON.parse(JSON.stringify(page)) as unknown;
}

function toCreateInput(
  dto: CreatePageDto,
  slug: string,
  actorId?: string,
): CreatePageInput {
  return {
    slug,
    title: dto.title,
    plasmicProjectId: dto.plasmicProjectId ?? null,
    plasmicPath: dto.plasmicPath ?? null,
    plasmicComponent: dto.plasmicComponent ?? null,
    seoTitle: dto.seoTitle ?? null,
    seoDescription: dto.seoDescription ?? null,
    canonicalUrl: dto.canonicalUrl ?? null,
    ogImageUrl: dto.ogImageUrl ?? null,
    noIndex: dto.noIndex ?? false,
    createdById: actorId ?? null,
  };
}

function toUpdateInput(
  dto: UpdatePageDto,
  actorId?: string,
): UpdatePageInput {
  const input: UpdatePageInput = {
    updatedById: actorId ?? null,
  };

  if (dto.slug !== undefined) input.slug = dto.slug;
  if (dto.title !== undefined) input.title = dto.title;
  if (dto.plasmicProjectId !== undefined) {
    input.plasmicProjectId = dto.plasmicProjectId;
  }
  if (dto.plasmicPath !== undefined) input.plasmicPath = dto.plasmicPath;
  if (dto.plasmicComponent !== undefined) {
    input.plasmicComponent = dto.plasmicComponent;
  }
  if (dto.seoTitle !== undefined) input.seoTitle = dto.seoTitle;
  if (dto.seoDescription !== undefined) {
    input.seoDescription = dto.seoDescription;
  }
  if (dto.canonicalUrl !== undefined) input.canonicalUrl = dto.canonicalUrl;
  if (dto.ogImageUrl !== undefined) input.ogImageUrl = dto.ogImageUrl;
  if (dto.noIndex !== undefined) input.noIndex = dto.noIndex;

  return input;
}

@Injectable()
export class PagesService {
  constructor(
    @Inject(PAGE_REPOSITORY)
    private readonly repository: PageRepository,
    private readonly audit: AuditService,
  ) {}

  async list(query: ListPagesQueryDto) {
    const input: ListPagesInput = {
      status: query.status,
      q: query.q,
      page: query.page ?? 1,
      limit: query.limit ?? 20,
    };

    return this.repository.list(input);
  }

  async listPublic(): Promise<PublicPage[]> {
    const result = await this.repository.list({
      page: 1,
      limit: 1000,
      publicOnly: true,
    });

    return result.items.map(toPublicPage);
  }

  async getAdmin(id: string): Promise<PageRecord> {
    const page = await this.repository.findById(id);
    if (!page) throw new NotFoundException('Page not found');
    return page;
  }

  async getPublicBySlug(rawSlug: string): Promise<PublicPage> {
    const slug = normalizeSlug(rawSlug);
    const page = await this.repository.findBySlug(slug);

    if (!page || page.status !== 'PUBLISHED') {
      throw new NotFoundException('Page not found');
    }

    return toPublicPage(page);
  }

  async create(dto: CreatePageDto, actorId?: string): Promise<PageRecord> {
    const slug = normalizeSlug(dto.slug);
    const existing = await this.repository.findBySlug(slug);

    if (existing) {
      throw new ConflictException('Page slug already exists');
    }

    const page = await this.repository.create(
      toCreateInput(dto, slug, actorId),
    );

    await this.audit.record({
      actorId,
      action: 'page.create',
      entityType: 'page',
      entityId: page.id,
      metadata: { slug: page.slug },
    });

    return page;
  }

  async update(
    id: string,
    dto: UpdatePageDto,
    actorId?: string,
  ): Promise<PageRecord> {
    const existing = await this.getAdmin(id);

    const input = toUpdateInput(dto, actorId);

    if (input.slug) {
      input.slug = normalizeSlug(input.slug);
      const duplicate = await this.repository.findBySlug(input.slug);
      if (duplicate && duplicate.id !== id) {
        throw new ConflictException('Page slug already exists');
      }
    }

    const page = await this.repository.update(id, input);

    await this.repository.createRevision(
      page.id,
      snapshotOf(page),
      actorId ?? null,
    );
    await this.audit.record({
      actorId,
      action: 'page.update',
      entityType: 'page',
      entityId: page.id,
      metadata: { slug: page.slug, previousSlug: existing.slug },
    });

    return page;
  }

  async publish(id: string, actorId?: string): Promise<PageRecord> {
    await this.getAdmin(id);
    const page = await this.repository.update(id, {
      status: 'PUBLISHED',
      publishedAt: new Date(),
      updatedById: actorId ?? null,
    });

    await this.repository.createRevision(
      page.id,
      snapshotOf(page),
      actorId ?? null,
    );
    await this.audit.record({
      actorId,
      action: 'page.publish',
      entityType: 'page',
      entityId: page.id,
      metadata: { slug: page.slug },
    });

    return page;
  }

  async unpublish(id: string, actorId?: string): Promise<PageRecord> {
    await this.getAdmin(id);
    const page = await this.repository.update(id, {
      status: 'DRAFT',
      publishedAt: null,
      updatedById: actorId ?? null,
    });

    await this.repository.createRevision(
      page.id,
      snapshotOf(page),
      actorId ?? null,
    );
    await this.audit.record({
      actorId,
      action: 'page.unpublish',
      entityType: 'page',
      entityId: page.id,
      metadata: { slug: page.slug },
    });

    return page;
  }

  async remove(id: string, actorId?: string): Promise<{ ok: true }> {
    const page = await this.getAdmin(id);
    await this.repository.remove(id);
    await this.audit.record({
      actorId,
      action: 'page.delete',
      entityType: 'page',
      entityId: id,
      metadata: { slug: page.slug },
    });

    return { ok: true };
  }

  async revisions(id: string) {
    await this.getAdmin(id);
    return this.repository.listRevisions(id);
  }

  async markPublishedByPlasmic(
    projectId: string,
    path: string,
  ): Promise<PageRecord | null> {
    const page = await this.repository.findByPlasmic(projectId, path);
    if (!page) return null;

    const updated = await this.repository.update(page.id, {
      status: 'PUBLISHED',
      publishedAt: new Date(),
    });

    await this.repository.createRevision(
      updated.id,
      snapshotOf(updated),
      null,
    );
    await this.audit.record({
      action: 'page.publish.plasmic',
      entityType: 'page',
      entityId: updated.id,
      metadata: { projectId, path },
    });

    return updated;
  }
}
