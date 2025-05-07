import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type AdminDocument = HydratedDocument<Admin>;

@Schema({
  timestamps: true, // 记录时间戳 createdAt 和 updatedAt
})
export class Admin {
  @Prop({ required: true, unique: true })
  adminid: string;

  @Prop({ required: true, unique: true })
  adminname: string;

  @Prop()
  password: string;

  @Prop()
  role: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
