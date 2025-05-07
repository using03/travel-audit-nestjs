import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin } from './schemas/admin.schema';

@Injectable()
export class AdminService {
  // 依赖注入
  constructor(@InjectModel(Admin.name) private readonly adminModel) {}

  async findOne(adminname: string, password: string) {
    return await this.adminModel.findOne({ adminname, password });
  }
}
