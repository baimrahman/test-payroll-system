export type CreateEmployeeAttendanceDto = {
    userId: string;
    payrollPeriodId: string;
    type: "check-in" | "check-out";
};