import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AdminUserDocument = HydratedDocument<AdminUser>;

@Schema({
  collection: 'users',
  versionKey: false,
})
export class AdminUser {
  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ default: '' })
  name!: string;

  @Prop({ default: '' })
  phone!: string;

  @Prop({ default: '' })
  location!: string;

  @Prop({ default: '09:00' })
  businessOpensAt!: string;

  @Prop({ default: '18:00' })
  businessCloseAt!: string;

  @Prop({ required: true })
  createdOn!: Date;

  @Prop({ required: true })
  modifiedOn!: Date;
}

export const AdminUserSchema = SchemaFactory.createForClass(AdminUser);
