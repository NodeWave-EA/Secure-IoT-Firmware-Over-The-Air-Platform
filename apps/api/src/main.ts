import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from '#app/app.module.js';
import { ConfigService } from '@nestjs/config';
import { VersioningType } from '@nestjs/common';
import { LoggerService } from '#logger/logger.service.js';

const logger = new LoggerService();
logger.setContext('Bootstrap');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new LoggerService(),
    bufferLogs: true,
    instrument: ObserveInstrument,
  });
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT') as number;

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
    defaultVersion: '1',
  });

  await app.listen(PORT);
  logger.info(`Server is running on http://localhost:${PORT}`);
}
await bootstrap();
