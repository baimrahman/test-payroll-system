import { Test, TestingModule } from '@nestjs/testing';
import { CreateEmployeeAttendanceUseCase } from './create-employee-attendance.use-case';
import { BusinessException } from '@domain/exceptions';
import { IAttendanceRepository, IPayrollPeriodRepository, IUserRepository } from '@domain/repositories';

describe('CreateEmployeeAttendanceUseCase', () => {
  let useCase: CreateEmployeeAttendanceUseCase;
  let userRepository: jest.Mocked<IUserRepository>;
  let payrollPeriodRepository: jest.Mocked<IPayrollPeriodRepository>;
  let attendanceRepository: jest.Mocked<IAttendanceRepository>;

  beforeEach(async () => {
    userRepository = {
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

    attendanceRepository = {
      find: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateEmployeeAttendanceUseCase,
        { provide: IUserRepository, useValue: userRepository },
        { provide: IPayrollPeriodRepository, useValue: payrollPeriodRepository },
        { provide: IAttendanceRepository, useValue: attendanceRepository },
      ],
    }).compile();

    useCase = module.get<CreateEmployeeAttendanceUseCase>(CreateEmployeeAttendanceUseCase);

    // Mock Date to return a fixed date
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-03-18')); // Monday
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should successfully create a new attendance record (check-in)', async () => {
    userRepository.find.mockResolvedValue({ id: '1' });
    payrollPeriodRepository.find.mockResolvedValue({ id: '1' });
    attendanceRepository.find.mockResolvedValue(null);

    const result = await useCase.execute({
      userId: '1',
      payrollPeriodId: '1',
      type: 'check-in',
    });

    expect(result).toEqual({ message: 'Attendance created successfully' });
    expect(attendanceRepository.create).toHaveBeenCalled();
  });

  it('should successfully update an existing attendance record (check-out)', async () => {
    userRepository.find.mockResolvedValue({ id: '1' });
    payrollPeriodRepository.find.mockResolvedValue({ id: '1' });
    attendanceRepository.find.mockResolvedValue({ id: '1' });

    const result = await useCase.execute({
      userId: '1',
      payrollPeriodId: '1',
      type: 'check-out',
    });

    expect(result).toEqual({ message: 'Attendance updated successfully' });
    expect(attendanceRepository.update).toHaveBeenCalled();
  });

  it('should throw BusinessException when user is not found', async () => {
    userRepository.find.mockResolvedValue(null);

    await expect(useCase.execute({
      userId: '999',
      payrollPeriodId: '1',
      type: 'check-in',
    })).rejects.toThrow(BusinessException);
  });

  it('should throw BusinessException when payroll period is not found', async () => {
    userRepository.find.mockResolvedValue({ id: '1' });
    payrollPeriodRepository.find.mockResolvedValue(null);

    await expect(useCase.execute({
      userId: '1',
      payrollPeriodId: '999',
      type: 'check-in',
    })).rejects.toThrow(BusinessException);
  });

  it('should throw BusinessException when the date is a weekend', async () => {
    // Set date to a Saturday
    jest.setSystemTime(new Date('2024-03-23')); // Saturday

    userRepository.find.mockResolvedValue({ id: '1' });
    payrollPeriodRepository.find.mockResolvedValue({ id: '1' });

    await expect(useCase.execute({
      userId: '1',
      payrollPeriodId: '1',
      type: 'check-in',
    })).rejects.toThrow(BusinessException);
  });

  it('should throw BusinessException when attendance already exists for the same day and payroll period', async () => {
    userRepository.find.mockResolvedValue({ id: '1' });
    payrollPeriodRepository.find.mockResolvedValue({ id: '1' });
    attendanceRepository.find.mockResolvedValue({ id: '1' });

    await expect(useCase.execute({
      userId: '1',
      payrollPeriodId: '1',
      type: 'check-in',
    })).rejects.toThrow(BusinessException);
  });
}); 