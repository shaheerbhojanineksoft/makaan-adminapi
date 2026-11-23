import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class UpdateAdminProfileDto {
  @ApiPropertyOptional({ example: 'Admin User' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;

  @ApiPropertyOptional({ example: 'admin@makaan.com' })
  @IsOptional()
  @IsEmail()
  @MaxLength(160)
  email?: string;

  @ApiPropertyOptional({ example: '+92-300-1234567' })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  @Matches(/^\+?[0-9][0-9\s\-()]*[0-9]$/, {
    message: 'phone must be a valid number (digits only, optional + - spaces)',
  })
  phone?: string;

  @ApiPropertyOptional({ example: 'Karachi, Pakistan' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  location?: string;

  @ApiPropertyOptional({ example: '09:00', description: 'HH:mm' })
  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'businessOpensAt must be HH:mm',
  })
  businessOpensAt?: string;

  @ApiPropertyOptional({ example: '18:00', description: 'HH:mm' })
  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'businessCloseAt must be HH:mm',
  })
  businessCloseAt?: string;
}
