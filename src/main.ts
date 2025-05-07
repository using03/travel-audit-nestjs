import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log', 'verbose'],
  });

  // 使用cookie-parser中间件
  app.use(cookieParser());
  logger.log('Cookie-parser中间件已配置');

  app.enableCors({
    origin: true, // 允许所有来源，简化测试过程
    credentials: true, // 允许携带Cookie
  });
  logger.log('CORS已配置，允许携带凭证');

  await app.listen(process.env.PORT || 3000);
  logger.log(`应用已启动，监听端口: ${process.env.PORT || 3000}`);
}

bootstrap().catch((err) => console.error('启动应用失败', err));
