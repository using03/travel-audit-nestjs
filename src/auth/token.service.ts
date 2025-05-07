import { Injectable, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);

  // 从cookie中获取token
  getToken(req: Request): string | null {
    const token = req.cookies?.jwt || null;
    this.logger.debug(`从Cookie获取Token: ${token ? '成功' : '未找到'}`);
    if (req.cookies && Object.keys(req.cookies).length > 0) {
      this.logger.debug(`当前Cookie: ${JSON.stringify(req.cookies)}`);
    }
    return token;
  }

  // 设置JWT token到HttpOnly cookie
  setToken(res: Response, token: string): void {
    this.logger.debug('设置HttpOnly Cookie');
    res.cookie('jwt', token, {
      httpOnly: true, // 防止客户端JavaScript访问
      secure: process.env.NODE_ENV === 'production', // 在生产环境中使用HTTPS
      sameSite: 'strict', // 防止CSRF攻击
      maxAge: 24 * 60 * 60 * 1000, // 1天过期
      path: '/', // 整个站点可用
    });
  }

  // 清除token cookie
  clearToken(res: Response): void {
    this.logger.debug('清除HttpOnly Cookie');
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });
  }
}
