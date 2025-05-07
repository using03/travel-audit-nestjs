import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  HttpCode,
  HttpStatus,
  Req,
  Logger,
} from '@nestjs/common';
import { CreateAdminDto } from 'src/admin/dto/create-admin.dto';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { Request, Response } from 'express';
import { TokenService } from './token.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() adminInfo: CreateAdminDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    this.logger.log(`尝试登录: ${adminInfo.adminname}`);
    const { adminname, password } = adminInfo;
    const { token, admin } = await this.authService.signIn(adminname, password);

    // 将token设置为HttpOnly cookie
    this.tokenService.setToken(response, token);
    this.logger.log(
      `用户 ${adminInfo.adminname} 登录成功，已设置HttpOnly Cookie`,
    );

    // 返回用户信息，但不包含token（因为已经在cookie中）
    return admin;
  }

  @Get('profile')
  getProfile(@Req() req: Request & { admin: any }) {
    this.logger.log('获取用户资料');
    return req.admin;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) response: Response) {
    // 清除token cookie
    this.tokenService.clearToken(response);
    this.logger.log('用户登出成功，已清除Cookie');
    return { message: '退出成功' };
  }
}
