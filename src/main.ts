import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { Environment } from './config/env.validations';
import { version } from '../package.json';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
// import { doubleCsrf } from 'csrf-csrf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'debug', 'fatal', 'warn', 'log'],
  });

  const configService = app.get(ConfigService);

  const APP_PORT: number = configService.get<number>('APP_PORT') || 3000;
  const NODE_ENV: Environment =
    configService.get<Environment>('NODE_ENV') || Environment.Development;
  const APP_BASENAME: string =
    configService.get<string>('app_basename') || 'app_basename';

  if (NODE_ENV == Environment.Production) app.use(helmet());

  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      // disableErrorMessages: false,
      // whitelist: true,
      // forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const openAPIConfig = new DocumentBuilder()
    .setTitle('Playground')
    .setDescription('Testing the Nest.JS API')
    .setVersion(`v${version}`)
    .build();

  openAPIConfig.servers = [];

  if (NODE_ENV == Environment.Production) {
    openAPIConfig.servers.push({
      url: 'https://istdev.findes.org.br{basename}',
      description: 'Produção',
      variables: {
        basename: {
          default: APP_BASENAME,
        },
      },
    });
  } else {
    openAPIConfig.servers.push({
      url: 'http://localhost:{port}',
      description: 'Desenvolvimento local',
      variables: {
        port: {
          default: APP_PORT,
        },
      },
    });
  }

  const document = SwaggerModule.createDocument(app, openAPIConfig);

  console.debug(`${APP_BASENAME}/swagger`);
  SwaggerModule.setup(`/swagger`, app, document, {
    customSiteTitle: 'Swagger UI | Playground',
    jsonDocumentUrl: 'openapi.json',
    explorer: true,
    swaggerOptions: {
      docExpansion: 'none',
    },
  });
  await app.listen(APP_PORT);
}
bootstrap();
