import { Module } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module.js';
import { PagesService } from './application/pages.service.js';
import { PAGE_REPOSITORY } from './domain/page.repository.js';
import { PrismaPageRepository } from './infrastructure/prisma-page.repository.js';
import { AdminPagesController } from './presentation/admin-pages.controller.js';
import { PublicPagesController } from './presentation/public-pages.controller.js';

@Module({
  imports: [AuditModule],
  controllers: [AdminPagesController, PublicPagesController],
  providers: [
    PagesService,
    {
      provide: PAGE_REPOSITORY,
      useClass: PrismaPageRepository,
    },
  ],
  exports: [PagesService],
})
export class ContentModule {}
