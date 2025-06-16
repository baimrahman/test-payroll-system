export class Payslip {
    id: string;
    userId: string;
    payrollPeriodId: string;
    baseSalary: number;
    overtimePay: number;
    reimbursements: number;
    totalPay: number;
    totalHours: number;
    totalOvertimeHours: number;
    createdAt: Date;
    updatedAt: Date;
}