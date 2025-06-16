import { PayrollPeriod } from '@domain/entities';
import { IBaseRepository } from './base.repository';

export abstract class IPayrollPeriodRepository extends IBaseRepository<PayrollPeriod> {
    abstract markAsProcessed(payrollPeriodId: string): Promise<void>;
}