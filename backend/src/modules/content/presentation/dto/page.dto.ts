import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import type { PageStatus } from '../../domain/page.js';

export class CreatePageDto {
  @IsString()
  @Matches(/^[a-z0-9]+(?:[/-][a-z0-9]+)*$/, {
    message:
      'slug must contain lowercase letters, numbers, hyphens and slashes only',
  })
  @MaxLength(200)
  slug!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title!: string;

  @IsOptional()
  @IsString()
  plasmicProjectId?: string;

  @IsOptional()
  @IsString()
  plasmicPath?: string;

  @IsOptional()
  @IsString()
  plasmicComponent?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  seoTitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  seoDescription?: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  canonicalUrl?: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  ogImageUrl?: string;

  @IsOptional()
  @IsBoolean()
  noIndex?: boolean;
}

export class UpdatePageDto extends PartialType(CreatePageDto) {}

export class ListPagesQueryDto {
  @IsOptional()
  @IsIn(['DRAFT', 'PUBLISHED', 'ARCHIVED'])
  status?: PageStatus;

  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;
}

export class PublicPageQueryDto {
  @IsString()
  slug!: string;
}

export class RevalidateDto {
  @IsArray()
  @IsString({ each: true })
  slugs!: string[];
}
