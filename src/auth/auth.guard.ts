import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './decorators/public.decorator';
import { TokenService } from './token.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private tokenService: TokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest(); // http 请求 req res
    const handler = context.getHandler();
    const controller = context.getClass();

    // 调试日志
    this.logger.debug(`当前请求路径: ${request.method} ${request.url}`);
    this.logger.debug(`处理函数: ${handler.name}`);
    this.logger.debug(`控制器: ${controller.name}`);

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      handler,
      controller,
    ]);

    this.logger.debug(`isPublic值: ${isPublic}`);
    this.logger.debug(
      `Public元数据: ${this.reflector.get(IS_PUBLIC_KEY, handler)}`,
    );

    if (isPublic) {
      // 不需要 token，开放
      this.logger.debug('路由标记为公开，跳过认证');
      return true;
    }

    // 从cookie中获取token或从Authorization header获取
    const cookieToken = this.tokenService.getToken(request);
    const headerToken = this.extractTokenFromHeader(request);
    const token = cookieToken || headerToken;

    this.logger.debug(`Cookie Token: ${cookieToken ? '存在' : '不存在'}`);
    this.logger.debug(`Header Token: ${headerToken ? '存在' : '不存在'}`);

    if (!token) {
      throw new UnauthorizedException('未登录');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });

      request['admin'] = payload; // adminInfo
    } catch {
      throw new UnauthorizedException('Token无效');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    // "Bearer"  "xxxxx"
    return type === 'Bearer' ? token : undefined;
  }
}
