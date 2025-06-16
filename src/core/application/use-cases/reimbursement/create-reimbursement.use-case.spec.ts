import { Test, TestingModule } from '@nestjs/testing';
import { CreateReimbursementUseCase } from './create-reimbursement.use-case';
import { BusinessException } from '@domain/exceptions';
import { IUserRepository, IReimbursementRepository, IPayrollPeriodRepository } from '@domain/repositories';
import { ReimbursementStatus } from '@domain/enums';

describe('CreateReimbursementUseCase', () => {
  let useCase: CreateReimbursementUseCase;
  let userRepository: jest.Mocked<IUserRepository>;
  let reimbursementRepository: jest.Mocked<IReimbursementRepository>;
  let payrollPeriodRepository: jest.Mocked<IPayrollPeriodRepository>;

  beforeEach(async () => {
    userRepository = {
      find: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    reimbursementRepository = {
      find: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
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
        CreateReimbursementUseCase,
        { provide: IUserRepository, useValue: userRepository },
        { provide: IReimbursementRepository, useValue: reimbursementRepository },
        { provide: IPayrollPeriodRepository, useValue: payrollPeriodRepository },
      ],
    }).compile();

    useCase = module.get<CreateReimbursementUseCase>(CreateReimbursementUseCase);
  });

  it('should successfully create a new reimbursement', async () => {
    userRepository.find.mockResolvedValue({ id: '1' });
    payrollPeriodRepository.find.mockResolvedValue({ id: '1' });
    reimbursementRepository.create.mockResolvedValue({
      id: '1',
      userId: '1',
      amount: 100,
      description: 'Test reimbursement',
      payrollPeriodId: '1',
      status: ReimbursementStatus.PENDING,
    });

    const result = await useCase.execute({
      userId: '1',
      payrollPeriodId: '1',
      amount: 100,
      description: 'Test reimbursement',
    });

    expect(result).toMatchObject({
      id: '1',
      userId: '1',
      amount: 100,
      description: 'Test reimbursement',
      payrollPeriodId: '1',
      status: ReimbursementStatus.PENDING,
    });
    expect(reimbursementRepository.create).toHaveBeenCalled();
  });

  it('should throw BusinessException when user is not found', async () => {
    userRepository.find.mockResolvedValue(null);
    await expect(useCase.execute({
      userId: '999',
      payrollPeriodId: '1',
      amount: 100,
      description: 'Test reimbursement',
    })).rejects.toThrow(BusinessException);
  });

  it('should throw BusinessException when payroll period is not found', async () => {
    userRepository.find.mockResolvedValue({ id: '1' });
    payrollPeriodRepository.find.mockResolvedValue(null);
    await expect(useCase.execute({
      userId: '1',
      payrollPeriodId: '999',
      amount: 100,
      description: 'Test reimbursement',
    })).rejects.toThrow(BusinessException);
  });
}); 