import * as controllers from './controller';
import { Module, Provider } from '@nestjs/common';
import {
  IUserRepository,
  IPayrollPeriodRepository,
  IReimbursementRepository,
} from '@domain/repositories';
import { CreateReimbursementUseCase } from '@application/use-cases/reimbursement';
import {
  UserRepository,
  PayrollPeriodRepository,
  ReimbursementRepository,
} from '@infrastructure/repositories';

const repositories: Provider[] = [
  {
    provide: IReimbursementRepository,
    useClass: ReimbursementRepository,
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

const useCases: Provider[] = [CreateReimbursementUseCase];

@Module({
  controllers: [controllers.ReimbursementController],
  providers: [...repositories, ...useCases],
})
export class ReimbursementModule {}
