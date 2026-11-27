import { BadRequestException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import type { AuditService } from '../../audit/audit.service.js';
import type { PageRepository } from '../domain/page.repository.js';
import type { PageRecord } from '../domain/page.js';
import { PagesService } from './pages.service.js';

function page(overrides: Partial<PageRecord> = {}): PageRecord {
  return {
    id: 'page-1',
    slug: 'landing',
    title: 'Landing',
    status: 'DRAFT',
    plasmicProjectId: null,
    plasmicPath: null,
    plasmicComponent: null,
    seoTitle: null,
    seoDescription: null,
    canonicalUrl: null,
    ogImageUrl: null,
    noIndex: false,
    publishedAt: null,
    createdById: null,
    updatedById: null,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    ...overrides,
  };
}

type MockPageRepository = {
  [Key in keyof PageRepository]: ReturnType<typeof vi.fn>;
};

function repository(): MockPageRepository {
  return {
    list: vi.fn(),
    findById: vi.fn(),
    findBySlug: vi.fn(),
    findByPlasmic: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    createRevision: vi.fn(),
    listRevisions: vi.fn(),
  };
}

function service(repo: MockPageRepository) {
  const audit = { record: vi.fn() } as unknown as AuditService;
  return new PagesService(repo as unknown as PageRepository, audit);
}

describe('PagesService', () => {
  it('normalizes a leading and trailing slash when creating a page', async () => {
    const repo = repository();
    const created = page();
    repo.findBySlug.mockResolvedValue(null);
    repo.create.mockResolvedValue(created);

    const result = await service(repo).create(
      { slug: '/landing/', title: 'Landing' },
      'user-1',
    );

    expect(result).toEqual(created);
    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        slug: 'landing',
        title: 'Landing',
        createdById: 'user-1',
      }),
    );
  });

  it('rejects an invalid slug', async () => {
    const repo = repository();

    await expect(
      service(repo).create({ slug: 'Hello World', title: 'Landing' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('publishes a page and records a revision', async () => {
    const repo = repository();
    const existing = page();
    const published = page({
      status: 'PUBLISHED',
      publishedAt: new Date('2026-01-02'),
    });
    repo.findById.mockResolvedValue(existing);
    repo.update.mockResolvedValue(published);

    const result = await service(repo).publish('page-1', 'user-1');

    expect(result.status).toBe('PUBLISHED');
    expect(repo.update).toHaveBeenCalledWith(
      'page-1',
      expect.objectContaining({ status: 'PUBLISHED' }),
    );
    expect(repo.createRevision).toHaveBeenCalledWith(
      'page-1',
      expect.any(Object),
      'user-1',
    );
  });

  it('does not expose a draft page on the public endpoint', async () => {
    const repo = repository();
    repo.findBySlug.mockResolvedValue(page({ status: 'DRAFT' }));

    await expect(service(repo).getPublicBySlug('landing')).rejects.toThrow(
      'Page not found',
    );
  });
});
