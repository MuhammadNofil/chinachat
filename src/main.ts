import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { raw } from 'body-parser';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['warn', 'error'],
  });

  // enabling cors
  app.enableCors();
  // enabling configService
  const configService = app.get(ConfigService);

  // global pipe setup
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // global prefix setup
  app.setGlobalPrefix('api/v1');

  app.setViewEngine('ejs');

  // web pack configuration
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  const PORT = await configService.get('PORT');

  await app.listen(PORT, () => {
    console.log(`LISTENTING ON PORT ${PORT}`);
  });
}
bootstrap();
