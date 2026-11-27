import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/auth/public.decorator.js';
import { PrismaService } from '../../database/prisma.service.js';

@ApiTags('health')
@Public()
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  health() {
    return {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }

  @Get('ready')
  async ready() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'ready', timestamp: new Date().toISOString() };
    } catch {
      throw new ServiceUnavailableException('Database is not ready');
    }
  }
}
