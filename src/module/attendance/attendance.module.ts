import * as controllers from './controller';
import { Module, Provider } from '@nestjs/common';
import { CreateEmployeeAttendanceUseCase } from '@application/use-cases/attendances';
import {
  IAttendanceRepository,
  IUserRepository,
  IPayrollPeriodRepository,
} from '@domain/repositories';
import {
  AttendanceRepository,
  UserRepository,
  PayrollPeriodRepository,
} from '@infrastructure/repositories';

const repositories: Provider[] = [
  {
    provide: IAttendanceRepository,
    useClass: AttendanceRepository,
  },
  {
    provide: IUserRepository,
    useClass: UserRepository,
  },
  {
    provide: IPayrollPeriodRepository,
    useClass: PayrollPeriodRepository,
  },
];

const useCases: Provider[] = [CreateEmployeeAttendanceUseCase];

@Module({
  controllers: [controllers.AttendanceController],
  providers: [...repositories, ...useCases],
})
export class AttendanceModule {}
