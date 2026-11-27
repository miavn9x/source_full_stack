import { Injectable } from '@nestjs/common';
import type { Page as PrismaPage, Prisma } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service.js';
import type {
  CreatePageInput,
  ListPagesInput,
  PageListResult,
  PageRepository,
  UpdatePageInput,
} from '../domain/page.repository.js';
import type {
  PageRecord,
  PageRevisionRecord,
  PageStatus,
} from '../domain/page.js';

function toPageRecord(page: PrismaPage): PageRecord {
  return {
    id: page.id,
    slug: page.slug,
    title: page.title,
    status: page.status as PageStatus,
    plasmicProjectId: page.plasmicProjectId,
    plasmicPath: page.plasmicPath,
    plasmicComponent: page.plasmicComponent,
    seoTitle: page.seoTitle,
    seoDescription: page.seoDescription,
    canonicalUrl: page.canonicalUrl,
    ogImageUrl: page.ogImageUrl,
    noIndex: page.noIndex,
    publishedAt: page.publishedAt,
    createdById: page.createdById,
    updatedById: page.updatedById,
    createdAt: page.createdAt,
    updatedAt: page.updatedAt,
  };
}

@Injectable()
export class PrismaPageRepository implements PageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async list(input: ListPagesInput): Promise<PageListResult> {
    const where: Prisma.PageWhereInput = {};

    if (input.publicOnly) {
      where.status = 'PUBLISHED';
    } else if (input.status) {
      where.status = input.status;
    }

    if (input.q) {
      where.OR = [
        { title: { contains: input.q, mode: 'insensitive' } },
        { slug: { contains: input.q, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.page.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        skip: (input.page - 1) * input.limit,
        take: input.limit,
      }),
      this.prisma.page.count({ where }),
    ]);

    return { items: items.map(toPageRecord), total };
  }

  async findById(id: string): Promise<PageRecord | null> {
    const page = await this.prisma.page.findUnique({ where: { id } });
    return page ? toPageRecord(page) : null;
  }

  async findBySlug(slug: string): Promise<PageRecord | null> {
    const page = await this.prisma.page.findUnique({ where: { slug } });
    return page ? toPageRecord(page) : null;
  }

  async findByPlasmic(
    projectId: string,
    path: string,
  ): Promise<PageRecord | null> {
    const page = await this.prisma.page.findFirst({
      where: {
        plasmicProjectId: projectId,
        plasmicPath: path,
      },
    });

    return page ? toPageRecord(page) : null;
  }

  async create(input: CreatePageInput): Promise<PageRecord> {
    const page = await this.prisma.page.create({
      data: {
        slug: input.slug,
        title: input.title,
        plasmicProjectId: input.plasmicProjectId ?? null,
        plasmicPath: input.plasmicPath ?? null,
        plasmicComponent: input.plasmicComponent ?? null,
        seoTitle: input.seoTitle ?? null,
        seoDescription: input.seoDescription ?? null,
        canonicalUrl: input.canonicalUrl ?? null,
        ogImageUrl: input.ogImageUrl ?? null,
        noIndex: input.noIndex ?? false,
        createdById: input.createdById ?? null,
        updatedById: input.createdById ?? null,
      },
    });

    return toPageRecord(page);
  }

  async update(id: string, input: UpdatePageInput): Promise<PageRecord> {
    const page = await this.prisma.page.update({
      where: { id },
      data: input,
    });

    return toPageRecord(page);
  }

  async remove(id: string): Promise<void> {
    await this.prisma.page.delete({ where: { id } });
  }

  async createRevision(
    pageId: string,
    snapshot: unknown,
    createdById?: string | null,
  ): Promise<void> {
    await this.prisma.pageRevision.create({
      data: {
        pageId,
        snapshot: snapshot as Prisma.InputJsonValue,
        createdById: createdById ?? null,
      },
    });
  }

  async listRevisions(pageId: string): Promise<PageRevisionRecord[]> {
    const revisions = await this.prisma.pageRevision.findMany({
      where: { pageId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        pageId: true,
        snapshot: true,
        createdById: true,
        createdAt: true,
      },
    });

    return revisions;
  }
}
