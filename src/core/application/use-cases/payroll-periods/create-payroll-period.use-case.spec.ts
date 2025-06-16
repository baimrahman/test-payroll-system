import { Test, TestingModule } from '@nestjs/testing';
import { CreatePayrollPeriodUseCase } from './create-payroll-period.use-case';
import { BusinessException } from '@domain/exceptions';
import { IPayrollPeriodRepository } from '@domain/repositories';
import { PayrollStatus } from '@domain/enums';

describe('CreatePayrollPeriodUseCase', () => {
  let useCase: CreatePayrollPeriodUseCase;
  let payrollPeriodRepository: jest.Mocked<IPayrollPeriodRepository>;

  beforeEach(async () => {
    payrollPeriodRepository = {
      find: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      markAsProcessed: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreatePayrollPeriodUseCase,
        { provide: IPayrollPeriodRepository, useValue: payrollPeriodRepository },
      ],
    }).compile();

    useCase = module.get<CreatePayrollPeriodUseCase>(CreatePayrollPeriodUseCase);
  });

  it('should successfully create a new payroll period', async () => {
    payrollPeriodRepository.find.mockResolvedValue(null);
    payrollPeriodRepository.create.mockResolvedValue({
      id: '1',
      startDate: new Date('2023-01-01'),
      endDate: new Date('2023-01-31'),
      status: PayrollStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await useCase.execute({
      startDate: new Date('2023-01-01'),
      endDate: new Date('2023-01-31'),
    });

    expect(result).toMatchObject({
      id: '1',
      startDate: new Date('2023-01-01'),
      endDate: new Date('2023-01-31'),
      status: PayrollStatus.PENDING,
    });
    expect(payrollPeriodRepository.create).toHaveBeenCalled();
  });

  it('should throw BusinessException when start date is after end date', async () => {
    await expect(useCase.execute({
      startDate: new Date('2023-01-31'),
      endDate: new Date('2023-01-01'),
    })).rejects.toThrow(BusinessException);
  });

  it('should throw BusinessException when payroll period already exists', async () => {
    payrollPeriodRepository.find.mockResolvedValue({ id: '1' });

    await expect(useCase.execute({
      startDate: new Date('2023-01-01'),
      endDate: new Date('2023-01-31'),
    })).rejects.toThrow(BusinessException);
  });
}); 