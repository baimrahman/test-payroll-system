import * as controllers from './controller';
import { Module, Provider } from '@nestjs/common';
import { CreatePayrollPeriodUseCase } from '@application/use-cases/payroll-periods';
import { IPayrollPeriodRepository } from '@domain/repositories';
import { PayrollPeriodRepository } from '@infrastructure/repositories';

const repositories: Provider[] = [
  {
    provide: IPayrollPeriodRepository,
    useClass: PayrollPeriodRepository,
  },
];

const useCases: Provider[] = [CreatePayrollPeriodUseCase];

@Module({
  controllers: [controllers.PayrollPeriodController],
  providers: [...repositories, ...useCases],
})
export class PayrollPeriodModule {}
