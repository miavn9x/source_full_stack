import { Injectable, Logger } from '@nestjs/common';
import { env } from '../../../config/env.js';

@Injectable()
export class NextRevalidateClient {
  private readonly logger = new Logger(NextRevalidateClient.name);

  async revalidate(slugs: string[]): Promise<void> {
    if (!env.NEXT_REVALIDATE_URL || !env.REVALIDATE_SECRET) {
      this.logger.warn(
        'NEXT_REVALIDATE_URL or REVALIDATE_SECRET is not configured; skipping revalidation',
      );
      return;
    }

    const uniqueSlugs = [...new Set(slugs.filter(Boolean))];
    if (uniqueSlugs.length === 0) return;

    const response = await fetch(env.NEXT_REVALIDATE_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-revalidate-secret': env.REVALIDATE_SECRET,
      },
      body: JSON.stringify({
        tags: uniqueSlugs.map((slug) => `page:${slug}`),
        paths: uniqueSlugs.map((slug) => `/${slug}`),
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Next.js revalidation failed with status ${response.status}`,
      );
    }
  }
}
