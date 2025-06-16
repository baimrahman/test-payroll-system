import { Payslip } from '@domain/entities';
import { IBaseRepository } from './base.repository';

export abstract class IPayslipRepository extends IBaseRepository<Payslip> { }