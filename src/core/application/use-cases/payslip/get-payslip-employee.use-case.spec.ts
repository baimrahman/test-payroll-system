import { Test, TestingModule } from '@nestjs/testing';
import { GetPayslipEmployeeUseCase } from './get-payslip-employee.use-case';
import { BusinessException } from '@domain/exceptions';
import {
  IPayslipRepository,
  IUserRepository,
  IAttendanceRepository,
  IOvertimeRepository,
  IReimbursementRepository,
} from '@domain/repositories';

describe('GetPayslipEmployeeUseCase', () => {
  let useCase: GetPayslipEmployeeUseCase;
  let payslipRepository: jest.Mocked<IPayslipRepository>;
  let userRepository: jest.Mocked<IUserRepository>;
  let attendanceRepository: jest.Mocked<IAttendanceRepository>;
  let overtimeRepository: jest.Mocked<IOvertimeRepository>;
  let reimbursementRepository: jest.Mocked<IReimbursementRepository>;

  beforeEach(async () => {
    payslipRepository = {
      find: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    userRepository = {
      find: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    attendanceRepository = {
      find: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    overtimeRepository = {
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

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetPayslipEmployeeUseCase,
        { provide: IPayslipRepository, useValue: payslipRepository },
        { provide: IUserRepository, useValue: userRepository },
        { provide: IAttendanceRepository, useValue: attendanceRepository },
        { provide: IOvertimeRepository, useValue: overtimeRepository },
        { provide: IReimbursementRepository, useValue: reimbursementRepository },
      ],
    }).compile();

    useCase = module.get<GetPayslipEmployeeUseCase>(GetPayslipEmployeeUseCase);
  });

  it('should successfully get employee payslip with all details', async () => {
    const mockUser = { id: '1' };
    const mockPayslip = {
      id: '1',
      userId: '1',
      payrollPeriodId: '1',
      baseSalary: 5000,
      overtimePay: 500,
      reimbursements: 200,
      totalHours: 160,
      totalOvertimeHours: 10,
      totalPay: 5700,
      status: 'PROCESSED',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockAttendance = [
      {
        id: '1',
        userId: '1',
        date: new Date(),
        checkIn: new Date(),
        checkOut: new Date(),
        payrollPeriodId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const mockOvertime = [
      {
        id: '1',
        userId: '1',
        date: new Date(),
        hours: 2,
        status: 'APPROVED',
        payrollPeriodId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const mockReimbursement = [
      {
        id: '1',
        userId: '1',
        date: new Date(),
        amount: 100,
        status: 'APPROVED',
        payrollPeriodId: '1',
        description: 'Office supplies',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    userRepository.find.mockResolvedValue(mockUser);
    payslipRepository.find.mockResolvedValue(mockPayslip);
    attendanceRepository.findAll.mockResolvedValue(mockAttendance);
    overtimeRepository.findAll.mockResolvedValue(mockOvertime);
    reimbursementRepository.findAll.mockResolvedValue(mockReimbursement);

    const result = await useCase.execute({
      userId: '1',
      payrollPeriodId: '1',
    });

    expect(result).toEqual({
      ...mockPayslip,
      breakdown: {
        attendance: mockAttendance,
        overtime: mockOvertime,
        reimbursement: mockReimbursement,
      },
    });

    expect(userRepository.find).toHaveBeenCalledWith({
      where: { id: '1' },
      select: { id: true },
    });

    expect(payslipRepository.find).toHaveBeenCalledWith({
      where: {
        userId: '1',
        payrollPeriodId: '1',
      },
      select: expect.any(Object),
    });

    expect(attendanceRepository.findAll).toHaveBeenCalledWith({
      where: {
        userId: '1',
        payrollPeriodId: '1',
      },
      select: expect.any(Object),
    });

    expect(overtimeRepository.findAll).toHaveBeenCalledWith({
      where: {
        userId: '1',
        payrollPeriodId: '1',
      },
      select: expect.any(Object),
    });

    expect(reimbursementRepository.findAll).toHaveBeenCalledWith({
      where: {
        userId: '1',
        payrollPeriodId: '1',
      },
      select: expect.any(Object),
    });
  });

  it('should throw BusinessException when user is not found', async () => {
    userRepository.find.mockResolvedValue(null);

    await expect(
      useCase.execute({
        userId: '999',
        payrollPeriodId: '1',
      }),
    ).rejects.toThrow(BusinessException);
  });

  it('should throw BusinessException when payslip is not found', async () => {
    userRepository.find.mockResolvedValue({ id: '1' });
    payslipRepository.find.mockResolvedValue(null);

    await expect(
      useCase.execute({
        userId: '1',
        payrollPeriodId: '999',
      }),
    ).rejects.toThrow(BusinessException);
  });

  it('should return empty arrays when no attendance, overtime, or reimbursements exist', async () => {
    const mockUser = { id: '1' };
    const mockPayslip = {
      id: '1',
      userId: '1',
      payrollPeriodId: '1',
      baseSalary: 5000,
      overtimePay: 0,
      reimbursements: 0,
      totalHours: 0,
      totalOvertimeHours: 0,
      totalPay: 5000,
      status: 'PROCESSED',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    userRepository.find.mockResolvedValue(mockUser);
    payslipRepository.find.mockResolvedValue(mockPayslip);
    attendanceRepository.findAll.mockResolvedValue([]);
    overtimeRepository.findAll.mockResolvedValue([]);
    reimbursementRepository.findAll.mockResolvedValue([]);

    const result = await useCase.execute({
      userId: '1',
      payrollPeriodId: '1',
    });

    expect(result).toEqual({
      ...mockPayslip,
      breakdown: {
        attendance: [],
        overtime: [],
        reimbursement: [],
      },
    });
  });
}); 