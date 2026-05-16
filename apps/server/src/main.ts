import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { cleanupOpenApiDoc, ZodValidationPipe } from 'nestjs-zod';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());

  app.useGlobalInterceptors(new TransformInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Todo API')
    .setDescription('TODO Platform REST API 문서')
    .setVersion('1.0')
    .addCookieAuth('access_token')
    .build();

  app.useGlobalPipes(new ZodValidationPipe());

  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const document = SwaggerModule.createDocument(app, config);
  cleanupOpenApiDoc(document);
  SwaggerModule.setup('api/docs', app, document);

  app.enableCors({
    origin: ['http://localhost:5173'],
    credentials: true,
  });

  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
