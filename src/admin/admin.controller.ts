import { Controller, Get, Post, Redirect } from '@nestjs/common';

import { AdminService } from './admin.service';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('info')
  @Redirect('/auth/profile', 302) // http状态码 302：临时重定向
  // eslint-disable-next-line @typescript-eslint/require-await
  async info() {
    return;
  }

  @Public()
  @Post('login')
  @Redirect('/auth/login', 307) // http状态码  307：临时
  // eslint-disable-next-line @typescript-eslint/require-await
  async login() {
    return;
  }
}
