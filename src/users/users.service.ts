import {
  ConflictException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { UpdateAdminProfileDto } from './dto/update-admin-profile.dto';
import { AdminUser, AdminUserDocument } from './schemas/admin-user.schema';

const DEFAULT_ADMIN_EMAIL = 'makaanadmin@gmail.com';
const DEFAULT_ADMIN_PASSWORD = 'makaan@0028';
const DEFAULT_ADMIN_NAME = 'Makaan Admin';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectModel(AdminUser.name)
    private readonly adminUserModel: Model<AdminUserDocument>,
  ) {}

  async onModuleInit() {
    await this.ensureDefaultAdmin();
  }

  async ensureDefaultAdmin() {
    const email = DEFAULT_ADMIN_EMAIL.trim().toLowerCase();

    const existing = await this.adminUserModel.findOne({ email }).exec();
    if (existing) {
      return existing;
    }

    const now = new Date();
    const passwordHash = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10);

    return this.adminUserModel.create({
      email,
      password: passwordHash,
      name: DEFAULT_ADMIN_NAME,
      phone: '',
      location: '',
      businessOpensAt: '09:00',
      businessCloseAt: '18:00',
      createdOn: now,
      modifiedOn: now,
    });
  }

  async findByEmail(email: string) {
    return this.adminUserModel
      .findOne({ email: email.trim().toLowerCase() })
      .exec();
  }

  async findById(id: string) {
    return this.adminUserModel.findById(id).exec();
  }

  toSafeAdmin(admin: AdminUserDocument) {
    return {
      _id: admin._id,
      email: admin.email,
      name: admin.name,
      phone: admin.phone,
      location: admin.location,
      businessOpensAt: admin.businessOpensAt,
      businessCloseAt: admin.businessCloseAt,
      modifiedOn: admin.modifiedOn,
    };
  }

  async updateProfile(adminId: string, dto: UpdateAdminProfileDto) {
    const admin = await this.adminUserModel.findById(adminId).exec();
    if (!admin) {
      throw new NotFoundException('Admin profile not found');
    }

    if (dto.email !== undefined) {
      const nextEmail = dto.email.trim().toLowerCase();
      if (nextEmail !== admin.email) {
        const clash = await this.adminUserModel
          .findOne({ email: nextEmail, _id: { $ne: admin._id } })
          .exec();
        if (clash) {
          throw new ConflictException('Email is already in use');
        }
        admin.email = nextEmail;
      }
    }

    if (dto.name !== undefined) admin.name = dto.name.trim();
    if (dto.phone !== undefined) admin.phone = dto.phone.trim();
    if (dto.location !== undefined) admin.location = dto.location.trim();
    if (dto.businessOpensAt !== undefined) {
      admin.businessOpensAt = dto.businessOpensAt.trim();
    }
    if (dto.businessCloseAt !== undefined) {
      admin.businessCloseAt = dto.businessCloseAt.trim();
    }

    admin.modifiedOn = new Date();
    await admin.save();
    return this.toSafeAdmin(admin);
  }
}
