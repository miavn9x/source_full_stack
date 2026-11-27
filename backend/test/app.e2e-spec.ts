import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { vi } from 'vitest';
import { AppModule } from './../src/app.module.js';
import { PrismaService } from './../src/database/prisma.service.js';

describe('health (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        $connect: vi.fn(),
        $disconnect: vi.fn(),
        $queryRaw: vi.fn().mockResolvedValue([{ ok: 1 }]),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.init();
  });

  it('GET /api/v1/health', () => {
    return request(app.getHttpServer())
      .get('/api/v1/health')
      .expect(200)
      .expect((response) => {
        expect(response.body.status).toBe('ok');
      });
  });

  it('GET /api/v1/health/ready', () => {
    return request(app.getHttpServer())
      .get('/api/v1/health/ready')
      .expect(200)
      .expect((response) => {
        expect(response.body.status).toBe('ready');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
