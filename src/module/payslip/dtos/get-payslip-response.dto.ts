// importAttendance, Overtime,  { Atte, Reimbursementndance, Overtime, Payslip, Reimbursement } from '@domain/entities';

// export class GetEmployeePayslipResponseDto extends Payslip {
//   breakdown: {
//     attendance: Attendance[];
//     overtime: Overtime[];
//     reimbursement: Reimbursement[];
//   };
// }

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsObject, IsString } from 'class-validator';

export class GetPayslipResponseDto {
  @ApiProperty({
    description: 'The ID of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'The ID of the payroll period',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsString()
  payrollPeriodId: string;

  @ApiProperty({
    description: 'The base salary',
    example: 100000,
  })
  @IsNotEmpty()
  @IsNumber()
  baseSalary: number;

  @ApiProperty({
    description: 'The overtime pay',
    example: 100000,
  })
  @IsNotEmpty()
  @IsNumber()
  overtimePay: number;

  @ApiProperty({
    description: 'The reimbursements',
    example: 100000,
  })
  @IsNotEmpty()
  @IsNumber()
  reimbursements: number;

  @ApiProperty({
    description: 'The total hours',
    example: 100000,
  })
  @IsNotEmpty()
  @IsNumber()
  totalHours: number;

  @ApiProperty({
    description: 'The total overtime hours',
    example: 100000,
  })
  @IsNotEmpty()
  @IsNumber()
  totalOvertimeHours: number;

  @ApiProperty({
    description: 'The total pay',
    example: 100000,
  })
  @IsNotEmpty()
  @IsNumber()
  totalPay: number;

  @ApiProperty({
    description: 'The breakdown',
    example: {
      attendance: [],
      overtime: [],
      reimbursement: [],
    },
  })
  @IsNotEmpty()
  @IsObject()
  breakdown: {
    attendance: any[];
    overtime: any[];
    reimbursement: any[];
  };
}