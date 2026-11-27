import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../../common/auth/public.decorator.js';
import { PagesService } from '../application/pages.service.js';
import { PublicPageQueryDto } from './dto/page.dto.js';

@ApiTags('public-pages')
@Public()
@Controller('public/pages')
export class PublicPagesController {
  constructor(private readonly pages: PagesService) {}

  @Get()
  list() {
    return this.pages.listPublic();
  }

  @Get('by-slug')
  getBySlug(@Query() query: PublicPageQueryDto) {
    return this.pages.getPublicBySlug(query.slug);
  }
}
