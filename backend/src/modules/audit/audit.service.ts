import { Injectable, Logger } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service.js';

export interface AuditInput {
  actorId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: Record<string, unknown>;
  ip?: string | null;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  async record(input: AuditInput): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          actorId: input.actorId ?? null,
          action: input.action,
          entityType: input.entityType,
          entityId: input.entityId ?? null,
          metadata: input.metadata as Prisma.InputJsonValue | undefined,
          ip: input.ip ?? null,
        },
      });
    } catch (error) {
      this.logger.warn(
        `Could not write audit log: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
