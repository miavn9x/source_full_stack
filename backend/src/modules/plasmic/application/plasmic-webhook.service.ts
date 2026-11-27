import {
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { createHash } from 'node:crypto';
import { env } from '../../../config/env.js';
import { PrismaService } from '../../../database/prisma.service.js';
import { AuditService } from '../../audit/audit.service.js';
import { PagesService } from '../../content/application/pages.service.js';
import { NextRevalidateClient } from '../infrastructure/next-revalidate.client.js';

type WebhookBody = Record<string, unknown>;
type WebhookHeaders = Record<string, string | string[] | undefined>;

function firstString(...values: unknown[]): string | undefined {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return undefined;
}

function nestedString(
  body: WebhookBody,
  key: string,
  nestedKey: string,
): string | undefined {
  const value = body[key];
  if (!value || typeof value !== 'object') return undefined;
  return firstString((value as Record<string, unknown>)[nestedKey]);
}

@Injectable()
export class PlasmicWebhookService {
  private readonly logger = new Logger(PlasmicWebhookService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly pages: PagesService,
    private readonly revalidate: NextRevalidateClient,
    private readonly audit: AuditService,
  ) {}

  async handle(
    headers: WebhookHeaders,
    body: WebhookBody,
  ): Promise<{ ok: boolean; duplicate?: boolean; status?: string }> {
    this.verifySecret(headers);

    const eventId =
      firstString(body.eventId, body.id, nestedString(body, 'event', 'id')) ??
      createHash('sha256').update(JSON.stringify(body)).digest('hex');

    const existing = await this.prisma.webhookEvent.findUnique({
      where: { eventId },
    });

    if (existing) {
      return {
        ok: true,
        duplicate: true,
        status: existing.status,
      };
    }

    const eventType =
      firstString(body.eventType, body.type, body.event) ?? 'unknown';
    const projectId = firstString(
      body.projectId,
      nestedString(body, 'project', 'id'),
    );
    const pagePath = firstString(
      body.pagePath,
      body.path,
      nestedString(body, 'page', 'path'),
      nestedString(body, 'component', 'path'),
    );

    const event = await this.prisma.webhookEvent.create({
      data: {
        source: 'plasmic',
        eventId,
        eventType,
        payload: body as Prisma.InputJsonValue,
        status: 'RECEIVED',
      },
    });

    if (!projectId || !pagePath) {
      await this.prisma.webhookEvent.update({
        where: { id: event.id },
        data: {
          status: 'UNMATCHED',
          error: 'Missing projectId or pagePath in webhook payload',
          processedAt: new Date(),
        },
      });

      return { ok: true, status: 'UNMATCHED' };
    }

    try {
      const page = await this.pages.markPublishedByPlasmic(projectId, pagePath);

      if (!page) {
        await this.prisma.webhookEvent.update({
          where: { id: event.id },
          data: {
            status: 'UNMATCHED',
            error: `No page registry entry for ${projectId} ${pagePath}`,
            processedAt: new Date(),
          },
        });

        return { ok: true, status: 'UNMATCHED' };
      }

      try {
        await this.revalidate.revalidate([page.slug]);
      } catch (error) {
        this.logger.error(
          `Page ${page.slug} published but revalidation failed: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
      }

      await this.prisma.webhookEvent.update({
        where: { id: event.id },
        data: { status: 'PROCESSED', processedAt: new Date() },
      });

      await this.audit.record({
        action: 'webhook.plasmic.processed',
        entityType: 'page',
        entityId: page.id,
        metadata: { eventId, projectId, pagePath },
      });

      return { ok: true, status: 'PROCESSED' };
    } catch (error) {
      await this.prisma.webhookEvent.update({
        where: { id: event.id },
        data: {
          status: 'FAILED',
          error: error instanceof Error ? error.message : String(error),
          processedAt: new Date(),
        },
      });

      throw error;
    }
  }

  private verifySecret(headers: WebhookHeaders): void {
    if (!env.PLASMIC_WEBHOOK_SECRET) return;

    const provided = firstString(
      headers['x-plasmic-webhook-secret'],
      headers['x-webhook-secret'],
      headers['authorization']?.toString().replace(/^Bearer\s+/i, ''),
    );

    if (provided !== env.PLASMIC_WEBHOOK_SECRET) {
      throw new UnauthorizedException('Invalid Plasmic webhook secret');
    }
  }
}
