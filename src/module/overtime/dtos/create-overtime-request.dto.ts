import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class CreateOvertimeRequestDto {
  @ApiProperty({
    description: 'The user ID',
    example: '123',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'The date of the overtime',
    example: '2025-01-01',
  })
  @IsDate()
  @Transform(({ value }) => new Date(value))
  date: Date;

  @ApiProperty({
    description: 'The hours of the overtime',
    example: 1,
  })
  @IsNumber()
  hours: number;

  @ApiProperty({
    description: 'The payroll period ID',
    example: '123',
  })
  @IsString()
  payrollPeriodId: string;
}
