import { Injectable } from '@nestjs/common';
import {
  GetEmployeePayslipRequestDto,
  GetEmployeePayslipResponseDto,
} from '@domain/dtos';
import {
  IPayslipRepository,
  IUserRepository,
  IAttendanceRepository,
  IOvertimeRepository,
  IReimbursementRepository,
} from '@domain/repositories';
import { BusinessException } from '@domain/exceptions';

@Injectable()
export class GetPayslipEmployeeUseCase {
  constructor(
    private readonly payslipRepository: IPayslipRepository,
    private readonly userRepository: IUserRepository,
    private readonly attendanceRepository: IAttendanceRepository,
    private readonly overtimeRepository: IOvertimeRepository,
    private readonly reimbursementRepository: IReimbursementRepository,
  ) {}

  async execute(
    request: GetEmployeePayslipRequestDto,
  ): Promise<GetEmployeePayslipResponseDto> {
    const user = await this.userRepository.find({
      where: {
        id: request.userId,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new BusinessException('User not found');
    }

    const payslip = await this.payslipRepository.find({
      where: {
        userId: request.userId,
        payrollPeriodId: request.payrollPeriodId,
      },
      select: {
        id: true,
        userId: true,
        payrollPeriodId: true,
        baseSalary: true,
        overtimePay: true,
        reimbursements: true,
        totalHours: true,
        totalOvertimeHours: true,
        totalPay: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!payslip) {
      throw new BusinessException('Payslip not found');
    }

    const [attendance, overtime, reimbursement] = await Promise.all([
      this.attendanceRepository.findAll({
        where: {
          userId: request.userId,
          payrollPeriodId: request.payrollPeriodId,
        },
        select: {
          id: true,
          userId: true,
          date: true,
          checkIn: true,
          checkOut: true,
          payrollPeriodId: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.overtimeRepository.findAll({
        where: {
          userId: request.userId,
          payrollPeriodId: request.payrollPeriodId,
        },
        select: {
          id: true,
          userId: true,
          date: true,
          hours: true,
          status: true,
          payrollPeriodId: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.reimbursementRepository.findAll({
        where: {
          userId: request.userId,
          payrollPeriodId: request.payrollPeriodId,
        },
        select: {
          id: true,
          userId: true,
          date: true,
          amount: true,
          status: true,
          payrollPeriodId: true,
          description: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
    ]);

    return {
        ...payslip,
        breakdown: {
          attendance,
          overtime,
          reimbursement,
        },
      };
  }
}
