import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AdminService } from 'src/admin/admin.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  // 依赖注入
  constructor(
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
  ) {}
  async signIn(adminname: string, password: string) {
    const admin = await this.adminService.findOne(adminname, password);
    if (!admin) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: p, ...adminInfo } = admin.toObject();

    // 返回用户信息和token
    return {
      token: this.jwtService.sign(adminInfo),
      admin: adminInfo,
    };
  }
}
