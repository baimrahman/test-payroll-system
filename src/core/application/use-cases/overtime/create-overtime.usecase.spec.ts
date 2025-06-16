import { Test, TestingModule } from '@nestjs/testing';
import { CreateOvertimeUseCase } from './create-overtime.usecase';
import { BusinessException } from '@domain/exceptions';
import { CreateOvertime } from '@domain/dtos';
import { OvertimeStatus } from '@domain/enums';
import { IUserRepository, IOvertimeRepository, IPayrollPeriodRepository } from '@domain/repositories';

describe('CreateOvertimeUseCase', () => {
  let useCase: CreateOvertimeUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockOvertimeRepository: jest.Mocked<IOvertimeRepository>;
  let mockPayrollPeriodRepository: jest.Mocked<IPayrollPeriodRepository>;

  beforeEach(async () => {
    mockUserRepository = {
      find: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<IUserRepository>;

    mockOvertimeRepository = {
      find: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<IOvertimeRepository>;

    mockPayrollPeriodRepository = {
      find: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      markAsProcessed: jest.fn(),
    } as jest.Mocked<IPayrollPeriodRepository>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateOvertimeUseCase,
        { provide: IUserRepository, useValue: mockUserRepository },
        { provide: IOvertimeRepository, useValue: mockOvertimeRepository },
        { provide: IPayrollPeriodRepository, useValue: mockPayrollPeriodRepository },
      ],
    }).compile();

    useCase = module.get<CreateOvertimeUseCase>(CreateOvertimeUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    const dto: CreateOvertime = {
      userId: '1',
      payrollPeriodId: '1',
      date: new Date(),
      hours: 2,
    };

    it('should successfully create a new overtime record', async () => {
      // Arrange
      mockUserRepository.find.mockResolvedValue({ id: '1' });
      mockPayrollPeriodRepository.find.mockResolvedValue({ id: '1' });
      mockOvertimeRepository.findAll.mockResolvedValue([]);
      mockOvertimeRepository.create.mockResolvedValue({ 
        id: '1', 
        ...dto, 
        status: OvertimeStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Act
      const result = await useCase.execute(dto);

      // Assert
      expect(result).toEqual({ 
        id: '1', 
        ...dto, 
        status: OvertimeStatus.PENDING,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
      expect(mockOvertimeRepository.create).toHaveBeenCalled();
    });

    it('should throw BusinessException when user is not found', async () => {
      // Arrange
      mockUserRepository.find.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(dto)).rejects.toThrow(BusinessException);
      await expect(useCase.execute(dto)).rejects.toThrow('User not found');
    });

    it('should throw BusinessException when payroll period is not found', async () => {
      // Arrange
      mockUserRepository.find.mockResolvedValue({ id: '1' });
      mockPayrollPeriodRepository.find.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(dto)).rejects.toThrow(BusinessException);
      await expect(useCase.execute(dto)).rejects.toThrow('Payroll period not found');
    });

    it('should throw BusinessException when total overtime hours exceed 3 hours', async () => {
      // Arrange
      mockUserRepository.find.mockResolvedValue({ id: '1' });
      mockPayrollPeriodRepository.find.mockResolvedValue({ id: '1' });
      mockOvertimeRepository.findAll.mockResolvedValue([{ hours: 2 }]);

      // Act & Assert
      await expect(useCase.execute(dto)).rejects.toThrow(BusinessException);
      await expect(useCase.execute(dto)).rejects.toThrow('Overtime hours must be less or equal to 3 hours');
    });
  });
}); 