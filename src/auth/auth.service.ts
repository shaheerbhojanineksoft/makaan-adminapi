import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

const JWT_EXPIRES_IN = '24h';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const admin = await this.usersService.findByEmail(dto.email);
    if (!admin) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const matched = await bcrypt.compare(dto.password, admin.password);
    if (!matched) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: String(admin._id),
      email: admin.email,
      type: 'admin',
    });

    return {
      accessToken,
      expiresIn: JWT_EXPIRES_IN,
      admin: this.usersService.toSafeAdmin(admin),
    };
  }
}
