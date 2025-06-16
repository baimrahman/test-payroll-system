import * as controllers from './controller';
import { Module, Provider } from '@nestjs/common';
import {
  IUserRepository,
  IPayrollPeriodRepository,
  IOvertimeRepository,
  IPayslipRepository,
  IAttendanceRepository,
  IReimbursementRepository,
} from '@domain/repositories';
import {
  UserRepository,
  PayrollPeriodRepository,
  OvertimeRepository,
  PayslipRepository,
  AttendanceRepository,
  ReimbursementRepository,
} from '@infrastructure/repositories';
import { GetPayslipEmployeeUseCase } from '@application/use-cases/payslip';

const repositories: Provider[] = [
  {
    provide: IPayslipRepository,
    useClass: PayslipRepository,
  },
  {
    provide: IUserRepository,
    useClass: UserRepository,
  },
  {
    provide: IPayrollPeriodRepository,
    useClass: PayrollPeriodRepository,
  },
  {
    provide: IAttendanceRepository,
    useClass: AttendanceRepository,
  },
  {
    provide: IOvertimeRepository,
    useClass: OvertimeRepository,
  },
  {
    provide: IReimbursementRepository,
    useClass: ReimbursementRepository,
  },
];

const useCases: Provider[] = [GetPayslipEmployeeUseCase];

@Module({
  controllers: [controllers.PayslipController],
  providers: [...repositories, ...useCases],
})
export class PayslipModule {}
