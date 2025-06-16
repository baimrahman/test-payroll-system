import { Test, TestingModule } from '@nestjs/testing';
import { ProcessPayrollUseCase } from './process-payroll.use-case';
import { BadRequestException } from '@nestjs/common';
import { ProcessPayrollDto } from '@domain/dtos';
import { UserRole } from '@domain/enums';
import {
  IPayrollPeriodRepository,
  IAttendanceRepository,
  IOvertimeRepository,
  IReimbursementRepository,
  IUserRepository,
  IPayslipRepository,
} from '@domain/repositories';

describe('ProcessPayrollUseCase', () => {
  let useCase: ProcessPayrollUseCase;
  let mockPayrollPeriodRepository: jest.Mocked<IPayrollPeriodRepository>;
  let mockAttendanceRepository: jest.Mocked<IAttendanceRepository>;
  let mockOvertimeRepository: jest.Mocked<IOvertimeRepository>;
  let mockReimbursementRepository: jest.Mocked<IReimbursementRepository>;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockPayslipRepository: jest.Mocked<IPayslipRepository>;

  const mockPayrollPeriod = {
    id: '1',
    status: 'PENDING',
    endDate: new Date('2024-03-31'),
  };

  const mockEmployees = [
    {
      id: '1',
      salary: 1000,
    },
    {
      id: '2',
      salary: 2000,
    },
  ];

  const mockAttendances = [
    {
      checkIn: new Date('2024-03-01T09:00:00'),
      checkOut: new Date('2024-03-01T17:00:00'),
    },
    {
      checkIn: new Date('2024-03-02T09:00:00'),
      checkOut: new Date('2024-03-02T17:00:00'),
    },
  ];

  const mockOvertimes = [
    { hours: 2 },
    { hours: 3 },
  ];

  const mockReimbursements = [
    { amount: 100 },
    { amount: 200 },
  ];

  beforeEach(async () => {
    mockPayrollPeriodRepository = {
      find: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      markAsProcessed: jest.fn(),
    } as jest.Mocked<IPayrollPeriodRepository>;

    mockAttendanceRepository = {
      find: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<IAttendanceRepository>;

    mockOvertimeRepository = {
      find: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<IOvertimeRepository>;

    mockReimbursementRepository = {
      find: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<IReimbursementRepository>;

    mockUserRepository = {
      find: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<IUserRepository>;

    mockPayslipRepository = {
      find: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<IPayslipRepository>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProcessPayrollUseCase,
        {
          provide: IPayrollPeriodRepository,
          useValue: mockPayrollPeriodRepository,
        },
        {
          provide: IAttendanceRepository,
          useValue: mockAttendanceRepository,
        },
        {
          provide: IOvertimeRepository,
          useValue: mockOvertimeRepository,
        },
        {
          provide: IReimbursementRepository,
          useValue: mockReimbursementRepository,
        },
        {
          provide: IUserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: IPayslipRepository,
          useValue: mockPayslipRepository,
        },
      ],
    }).compile();

    useCase = module.get<ProcessPayrollUseCase>(ProcessPayrollUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    const dto: ProcessPayrollDto = {
      payrollPeriodId: '1',
    };

    it('should successfully process payroll for all employees', async () => {
      // Arrange
      mockPayrollPeriodRepository.find.mockResolvedValue(mockPayrollPeriod);
      mockUserRepository.findAll.mockResolvedValue(mockEmployees);
      mockAttendanceRepository.findAll.mockResolvedValue(mockAttendances);
      mockOvertimeRepository.findAll.mockResolvedValue(mockOvertimes);
      mockReimbursementRepository.findAll.mockResolvedValue(mockReimbursements);

      // Act
      await useCase.execute(dto);

      // Assert
      expect(mockPayrollPeriodRepository.find).toHaveBeenCalledWith({
        where: { id: dto.payrollPeriodId },
        select: { status: true, endDate: true },
      });

      expect(mockUserRepository.findAll).toHaveBeenCalledWith({
        where: { role: { in: [UserRole.EMPLOYEE] } },
        select: { id: true, salary: true },
      });

      expect(mockPayslipRepository.create).toHaveBeenCalledTimes(2);
      expect(mockPayrollPeriodRepository.markAsProcessed).toHaveBeenCalledWith(
        dto.payrollPeriodId,
      );
    });

    it('should throw BadRequestException when payroll period is not found', async () => {
      // Arrange
      mockPayrollPeriodRepository.find.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(dto)).rejects.toThrow(BadRequestException);
      await expect(useCase.execute(dto)).rejects.toThrow(
        'Payroll period not found',
      );
    });

    it('should throw BadRequestException when payroll period is already processed', async () => {
      // Arrange
      mockPayrollPeriodRepository.find.mockResolvedValue({
        ...mockPayrollPeriod,
        status: 'PROCESSED',
      });

      // Act & Assert
      await expect(useCase.execute(dto)).rejects.toThrow(BadRequestException);
      await expect(useCase.execute(dto)).rejects.toThrow(
        'Payroll for this period has already been processed',
      );
    });

    it('should throw BadRequestException when payroll period is in the future', async () => {
      // Arrange
      const now = new Date();
      const futureEndDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      mockPayrollPeriodRepository.find.mockResolvedValue({
        ...mockPayrollPeriod,
        endDate: futureEndDate,
      });
      mockUserRepository.findAll.mockResolvedValue([]); // Prevent employees is not iterable error

      // Act & Assert
      await expect(useCase.execute(dto)).rejects.toThrow(BadRequestException);
      await expect(useCase.execute(dto)).rejects.toThrow(
        'Cannot process payroll for a future period',
      );
    });

    it('should handle employees with no attendance records', async () => {
      // Arrange
      mockPayrollPeriodRepository.find.mockResolvedValue(mockPayrollPeriod);
      mockUserRepository.findAll.mockResolvedValue(mockEmployees);
      mockAttendanceRepository.findAll.mockResolvedValue([]);
      mockOvertimeRepository.findAll.mockResolvedValue([]);
      mockReimbursementRepository.findAll.mockResolvedValue([]);

      // Act
      await useCase.execute(dto);

      // Assert
      expect(mockPayslipRepository.create).toHaveBeenCalledTimes(2);
      expect(mockPayslipRepository.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          baseSalary: 0,
          overtimePay: 0,
          reimbursements: 0,
          totalPay: 0,
        }),
      });
    });

    it('should correctly calculate total pay with all components', async () => {
      // Arrange
      mockPayrollPeriodRepository.find.mockResolvedValue(mockPayrollPeriod);
      mockUserRepository.findAll.mockResolvedValue([mockEmployees[0]]);
      mockAttendanceRepository.findAll.mockResolvedValue(mockAttendances);
      mockOvertimeRepository.findAll.mockResolvedValue(mockOvertimes);
      mockReimbursementRepository.findAll.mockResolvedValue(mockReimbursements);

      // Act
      await useCase.execute(dto);

      // Assert
      const expectedBaseSalary = 16 * mockEmployees[0].salary; // 8 hours * 2 days
      const expectedOvertimePay = 5 * mockEmployees[0].salary; // 2 + 3 hours
      const expectedReimbursements = 300; // 100 + 200
      const expectedTotalPay =
        expectedBaseSalary + expectedOvertimePay + expectedReimbursements;

      expect(mockPayslipRepository.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          baseSalary: expectedBaseSalary,
          overtimePay: expectedOvertimePay,
          reimbursements: expectedReimbursements,
          totalPay: expectedTotalPay,
        }),
      });
    });

    it('should handle incomplete attendance records (missing checkOut)', async () => {
      // Arrange
      const incompleteAttendances = [
        {
          checkIn: new Date('2024-03-01T09:00:00'),
          checkOut: null,
        },
      ];

      mockPayrollPeriodRepository.find.mockResolvedValue(mockPayrollPeriod);
      mockUserRepository.findAll.mockResolvedValue([mockEmployees[0]]);
      mockAttendanceRepository.findAll.mockResolvedValue(incompleteAttendances);
      mockOvertimeRepository.findAll.mockResolvedValue([]);
      mockReimbursementRepository.findAll.mockResolvedValue([]);

      // Act
      await useCase.execute(dto);

      // Assert
      expect(mockPayslipRepository.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          baseSalary: 0, // No hours counted for incomplete attendance
          overtimePay: 0,
          reimbursements: 0,
          totalPay: 0,
        }),
      });
    });
  });
}); 