import { OvertimeStatus } from "@domain/enums";

export class Overtime {
    id: string;
    userId: string;
    date: Date;
    hours: number;
    status: OvertimeStatus;
    payrollPeriodId: string;
    createdAt: Date;
    updatedAt: Date;
}