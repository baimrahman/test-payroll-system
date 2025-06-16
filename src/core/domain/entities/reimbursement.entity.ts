import { ReimbursementStatus } from "@domain/enums";

export class Reimbursement {
    id: string;
    userId: string;
    payrollPeriodId: string;
    amount: number;
    description: string;
    status: ReimbursementStatus;
}