import { Attendance, Overtime, Payslip, Reimbursement } from '@domain/entities';

export class GetEmployeePayslipResponseDto extends Payslip {
  breakdown: {
    attendance: Attendance[];
    overtime: Overtime[];
    reimbursement: Reimbursement[];
  };
}