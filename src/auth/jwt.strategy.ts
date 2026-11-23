import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';

export type JwtPayload = {
  sub: string;
  email: string;
  type: 'admin';
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'change-me',
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload?.sub || payload.type !== 'admin') {
      throw new UnauthorizedException('Invalid token');
    }
    const admin = await this.usersService.findById(payload.sub);
    if (!admin) {
      throw new UnauthorizedException('Admin not found');
    }
    return {
      adminId: String(admin._id),
      email: admin.email,
      type: 'admin' as const,
    };
  }
}
