import * as controllers from './controller';
import { Module, Provider } from '@nestjs/common';
import {
  IUserRepository,
  IPayrollPeriodRepository,
  IOvertimeRepository,
} from '@domain/repositories';
import { CreateOvertimeUseCase } from '@application/use-cases/overtime';
import {
  OvertimeRepository,
  UserRepository,
  PayrollPeriodRepository,
} from '@infrastructure/repositories';

const repositories: Provider[] = [
  {
    provide: IOvertimeRepository,
    useClass: OvertimeRepository,
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

const useCases: Provider[] = [CreateOvertimeUseCase];

@Module({
  controllers: [controllers.OvertimeController],
  providers: [...repositories, ...useCases],
})
export class OvertimeModule {}
