import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@makaan.com' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  email!: string;

  @ApiProperty({ example: 'password123', minLength: 4 })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(128)
  password!: string;
}
