import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateAgencyStatusDto {
  @ApiProperty({ example: true, description: 'Set agency active or inactive' })
  @IsBoolean()
  isActive!: boolean;
}
