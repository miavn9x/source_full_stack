import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module.js';
import { assertProductionSecrets, env } from './config/env.js';

async function bootstrap(): Promise<void> {
  assertProductionSecrets();

  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.enableCors({
    origin: env.CORS_ORIGIN.split(',').map((origin) => origin.trim()),
    credentials: true,
  });
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.enableShutdownHooks();

  if (env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Business API')
      .setDescription('NestJS API for the Next.js frontend and Plasmic CMS')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  await app.listen(env.PORT, '0.0.0.0');
  Logger.log(`API listening on http://localhost:${env.PORT}/api/v1`, 'Bootstrap');
}

await bootstrap();
