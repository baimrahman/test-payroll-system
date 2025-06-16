import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateReimbursementRequestDto {
  @ApiProperty({
    description: 'The user ID',
    example: '123',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'The amount of the reimbursement',
    example: 100,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'The description of the reimbursement',
    example: 'Travel expenses',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'The payroll period ID',
    example: '123',
  })
  @IsString()
  payrollPeriodId: string;
}