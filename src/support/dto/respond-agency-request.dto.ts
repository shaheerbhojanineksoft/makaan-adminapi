import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class RespondAgencyRequestDto {
  @ApiProperty({
    example: 'We fixed the publish queue. Please try again and tell us if it still fails.',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(4000)
  response!: string;
}
