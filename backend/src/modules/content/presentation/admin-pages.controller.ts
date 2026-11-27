import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../common/auth/current-user.decorator.js';
import { RequirePermissions } from '../../../common/auth/permissions.decorator.js';
import type { AuthUser } from '../../../common/auth/auth-user.js';
import { PagesService } from '../application/pages.service.js';
import {
  CreatePageDto,
  ListPagesQueryDto,
  UpdatePageDto,
} from './dto/page.dto.js';

@ApiTags('admin-pages')
@ApiBearerAuth()
@Controller('admin/pages')
export class AdminPagesController {
  constructor(private readonly pages: PagesService) {}

  @Get()
  @RequirePermissions('page:read')
  async list(@Query() query: ListPagesQueryDto) {
    const result = await this.pages.list(query);

    return {
      data: result.items,
      meta: {
        page: query.page ?? 1,
        limit: query.limit ?? 20,
        total: result.total,
      },
    };
  }

  @Post()
  @RequirePermissions('page:create')
  create(@Body() dto: CreatePageDto, @CurrentUser() user: AuthUser) {
    return this.pages.create(dto, user.id);
  }

  @Get(':id')
  @RequirePermissions('page:read')
  get(@Param('id') id: string) {
    return this.pages.getAdmin(id);
  }

  @Patch(':id')
  @RequirePermissions('page:update')
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePageDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.pages.update(id, dto, user.id);
  }

  @Delete(':id')
  @RequirePermissions('page:delete')
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.pages.remove(id, user.id);
  }

  @Post(':id/publish')
  @RequirePermissions('page:publish')
  publish(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.pages.publish(id, user.id);
  }

  @Post(':id/unpublish')
  @RequirePermissions('page:publish')
  unpublish(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.pages.unpublish(id, user.id);
  }

  @Get(':id/revisions')
  @RequirePermissions('page:read')
  revisions(@Param('id') id: string) {
    return this.pages.revisions(id);
  }
}
