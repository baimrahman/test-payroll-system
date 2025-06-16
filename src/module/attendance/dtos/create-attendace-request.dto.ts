import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDate, IsIn, IsString } from "class-validator";

export class CreateAttendanceRequestDto {
  @ApiProperty({
    description: 'The user ID',
    example: '123',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'The date of the attendance',
    example: '2025-01-01',
  })
  @IsDate()
  @Transform(({ value }) => new Date(value))
  date: Date;

  @ApiProperty({
    description: 'Type of attendance',
    example: 'check-in',
  })
  @IsString()
  @IsIn(['check-in', 'check-out'])
  type: string;

  @ApiProperty({
    description: 'The payroll period ID',
    example: '123',
  })
  @IsString()
  payrollPeriodId: string;
}