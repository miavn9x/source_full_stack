import { Body, Controller, Headers, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../../common/auth/public.decorator.js';
import { PlasmicWebhookService } from '../application/plasmic-webhook.service.js';

@ApiTags('webhooks')
@Public()
@Controller('webhooks/plasmic')
export class PlasmicWebhookController {
  constructor(private readonly webhook: PlasmicWebhookService) {}

  @Post()
  handle(
    @Headers() headers: Record<string, string | string[] | undefined>,
    @Body() body: Record<string, unknown>,
  ) {
    return this.webhook.handle(headers, body);
  }
}
