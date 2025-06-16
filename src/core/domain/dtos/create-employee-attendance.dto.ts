export type CreateEmployeeAttendanceDto = {
    userId: string;
    date: Date;
    payrollPeriodId: string;
    type: "check-in" | "check-out";
};