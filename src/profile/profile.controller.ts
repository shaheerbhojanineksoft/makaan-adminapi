import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentAdmin } from '../auth/current-admin.decorator';
import type { CurrentAdminPayload } from '../auth/current-admin.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateAdminProfileDto } from '../users/dto/update-admin-profile.dto';
import { UsersService } from '../users/users.service';

@ApiTags('admin-profile')
@ApiBearerAuth()
@Controller('admin/profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get current admin profile' })
  async getProfile(@CurrentAdmin() admin: CurrentAdminPayload) {
    const doc = await this.usersService.findById(admin.adminId);
    if (!doc) {
      return null;
    }
    return this.usersService.toSafeAdmin(doc);
  }

  @Patch()
  @ApiOperation({ summary: 'Update current admin profile' })
  updateProfile(
    @CurrentAdmin() admin: CurrentAdminPayload,
    @Body() dto: UpdateAdminProfileDto,
  ) {
    return this.usersService.updateProfile(admin.adminId, dto);
  }
}
