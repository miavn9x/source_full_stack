import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RequirePermissions } from '../../../common/auth/permissions.decorator.js';
import { RevalidateDto } from '../../content/presentation/dto/page.dto.js';
import { NextRevalidateClient } from '../infrastructure/next-revalidate.client.js';

@ApiTags('admin-plasmic')
@ApiBearerAuth()
@Controller('admin/plasmic')
export class PlasmicAdminController {
  constructor(private readonly revalidate: NextRevalidateClient) {}

  @Post('revalidate')
  @RequirePermissions('page:publish')
  async revalidatePages(@Body() dto: RevalidateDto) {
    await this.revalidate.revalidate(dto.slugs);
    return { ok: true, slugs: dto.slugs };
  }
}
