import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthLoginRequestDto {
  @ApiProperty({
    description: 'The username of the user',
    example: 'admin',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'admin123',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}