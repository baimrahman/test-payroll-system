import { ApiProperty } from "@nestjs/swagger";
import { Transform } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class CreatePayrollPeriodRequestDto {
  @ApiProperty({
    description: 'The start date of the payroll period',
    example: '2025-01-01',
  })
  @IsDate()
  @Transform(({ value }) => new Date(value))
  startDate: Date;

  @ApiProperty({
    description: 'The end date of the payroll period',
    example: '2025-01-31',
  })
  @IsDate()
  @Transform(({ value }) => new Date(value))
  endDate: Date;
}