/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalErrorHandler } from './app/common/filters/global-error-handler.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  const port = process.env.PORT || 3000;

  app.enableCors();

  app.setGlobalPrefix(globalPrefix);

  app.useGlobalPipes(new ValidationPipe());

   app.useGlobalFilters(new GlobalErrorHandler());

  // --- Swagger Configuration ---
  const config = new DocumentBuilder()
    .setTitle('Gemini AI Bot API')
    .setDescription('The API for the Gemini AI Chatbot application')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document); // <-- This sets up the UI at /api-docs
  // -----------------------------

  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
