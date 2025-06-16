import { Test, TestingModule } from '@nestjs/testing';
import { CreateEmployeeAttendanceUseCase } from '@application/use-cases/attendances';
import { BusinessException } from '@domain/exceptions';
import { isWeekend } from '@shared/utils';

// Mock the repositories
const mockUserRepository = {
  find: jest.fn(),
};

const mockPayrollPeriodRepository = {
  find: jest.fn(),
};

const mockAttendanceRepository = {
  find: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
};

// Mock the isWeekend utility
jest.mock('@shared/utils', () => ({
  isWeekend: jest.fn(),
}));

describe('CreateEmployeeAttendanceUseCase', () => {
  let useCase: CreateEmployeeAttendanceUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateEmployeeAttendanceUseCase,
        {
          provide: 'IUserRepository',
          useValue: mockUserRepository,
        },
        {
          provide: 'IPayrollPeriodRepository',
          useValue: mockPayrollPeriodRepository,
        },
        {
          provide: 'IAttendanceRepository',
          useValue: mockAttendanceRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateEmployeeAttendanceUseCase>(CreateEmployeeAttendanceUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    const mockRequest = {
      userId: 'user-123',
      payrollPeriodId: 'period-123',
      type: 'check-in',
    };

    it('should create attendance successfully', async () => {
      // Mock successful repository responses
      mockUserRepository.find.mockResolvedValue({ id: 'user-123' });
      mockPayrollPeriodRepository.find.mockResolvedValue({ id: 'period-123' });
      mockAttendanceRepository.find.mockResolvedValue(null);
      (isWeekend as jest.Mock).mockReturnValue(false);

      const result = await useCase.execute(mockRequest);

      expect(result).toEqual({ message: 'Attendance created successfully' });
      expect(mockAttendanceRepository.create).toHaveBeenCalled();
    });

    it('should throw BusinessException when user not found', async () => {
      mockUserRepository.find.mockResolvedValue(null);

      await expect(useCase.execute(mockRequest)).rejects.toThrow(BusinessException);
      await expect(useCase.execute(mockRequest)).rejects.toThrow('User not found');
    });

    it('should throw BusinessException when payroll period not found', async () => {
      mockUserRepository.find.mockResolvedValue({ id: 'user-123' });
      mockPayrollPeriodRepository.find.mockResolvedValue(null);

      await expect(useCase.execute(mockRequest)).rejects.toThrow(BusinessException);
      await expect(useCase.execute(mockRequest)).rejects.toThrow('Payroll period not found');
    });

    it('should throw BusinessException when trying to submit attendance on weekend', async () => {
      mockUserRepository.find.mockResolvedValue({ id: 'user-123' });
      mockPayrollPeriodRepository.find.mockResolvedValue({ id: 'period-123' });
      (isWeekend as jest.Mock).mockReturnValue(true);

      await expect(useCase.execute(mockRequest)).rejects.toThrow(BusinessException);
      await expect(useCase.execute(mockRequest)).rejects.toThrow('Cannot submit attendance on weekends');
    });

    it('should throw BusinessException when attendance already exists for check-in', async () => {
      mockUserRepository.find.mockResolvedValue({ id: 'user-123' });
      mockPayrollPeriodRepository.find.mockResolvedValue({ id: 'period-123' });
      mockAttendanceRepository.find.mockResolvedValue({ id: 'attendance-123' });
      (isWeekend as jest.Mock).mockReturnValue(false);

      await expect(useCase.execute(mockRequest)).rejects.toThrow(BusinessException);
      await expect(useCase.execute(mockRequest)).rejects.toThrow('Attendance already exists for this day');
    });

    it('should update check-out time when attendance exists and type is check-out', async () => {
      mockUserRepository.find.mockResolvedValue({ id: 'user-123' });
      mockPayrollPeriodRepository.find.mockResolvedValue({ id: 'period-123' });
      mockAttendanceRepository.find.mockResolvedValue({ id: 'attendance-123' });
      (isWeekend as jest.Mock).mockReturnValue(false);

      const result = await useCase.execute({ ...mockRequest, type: 'check-out' });

      expect(result).toEqual({ message: 'Attendance updated successfully' });
      expect(mockAttendanceRepository.update).toHaveBeenCalled();
    });
  });
}); 