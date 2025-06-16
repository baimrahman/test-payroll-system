import { PayrollStatus } from '@domain/enums';

export interface PayrollPeriod {
  id: string;
  startDate: Date;
  endDate: Date;
  status: PayrollStatus;
  createdAt: Date;
  updatedAt: Date;
} 