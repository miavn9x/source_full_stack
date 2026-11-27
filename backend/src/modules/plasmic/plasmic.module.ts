import { Module } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module.js';
import { ContentModule } from '../content/content.module.js';
import { PlasmicWebhookService } from './application/plasmic-webhook.service.js';
import { NextRevalidateClient } from './infrastructure/next-revalidate.client.js';
import { PlasmicAdminController } from './presentation/plasmic-admin.controller.js';
import { PlasmicWebhookController } from './presentation/plasmic-webhook.controller.js';

@Module({
  imports: [ContentModule, AuditModule],
  controllers: [PlasmicWebhookController, PlasmicAdminController],
  providers: [PlasmicWebhookService, NextRevalidateClient],
  exports: [NextRevalidateClient],
})
export class PlasmicModule {}
