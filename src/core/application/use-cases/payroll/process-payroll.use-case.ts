import { Injectable, BadRequestException } from '@nestjs/common';
import { ProcessPayrollDto } from '@domain/dtos';
import {
  IPayrollPeriodRepository,
  IAttendanceRepository,
  IOvertimeRepository,
  IReimbursementRepository,
  IUserRepository,
  IPayslipRepository,
} from '@domain/repositories';
import { UserRole } from '@domain/enums';

@Injectable()
export class ProcessPayrollUseCase {
  constructor(
    private readonly payrollPeriodRepository: IPayrollPeriodRepository,
    private readonly attendanceRepository: IAttendanceRepository,
    private readonly overtimeRepository: IOvertimeRepository,
    private readonly reimbursementRepository: IReimbursementRepository,
    private readonly userRepository: IUserRepository,
    private readonly payslipRepository: IPayslipRepository,
  ) {}

  async execute(dto: ProcessPayrollDto): Promise<void> {
    const payrollPeriod = await this.payrollPeriodRepository.find({
      where: {
        id: dto.payrollPeriodId,
      },
      select: {
        status: true,
        endDate: true,
      },
    });
    if (!payrollPeriod) {
      throw new BadRequestException('Payroll period not found');
    }

    if (payrollPeriod.status === 'PROCESSED') {
      throw new BadRequestException(
        'Payroll for this period has already been processed',
      );
    }

    if (new Date(payrollPeriod.endDate) > new Date()) {
      throw new BadRequestException(
        'Cannot process payroll for a future period',
      );
    }

    const employees = await this.userRepository.findAll({
      where: {
        role: {
          in: [UserRole.EMPLOYEE],
        },
      },
      select: {
        id: true,
        salary: true,
      },
    });

    for (const employee of employees) {
      const [attendances, overtimes, reimbursements] = await Promise.all([
        this.attendanceRepository.findAll({
          where: {
            userId: employee.id,
            payrollPeriodId: dto.payrollPeriodId,
          },
          select: {
            checkIn: true,
            checkOut: true,
          },
        }),
        this.overtimeRepository.findAll({
          where: {
            userId: employee.id,
            payrollPeriodId: dto.payrollPeriodId,
          },
          select: {
            hours: true,
          },
        }),
        this.reimbursementRepository.findAll({
          where: {
            userId: employee.id,
            payrollPeriodId: dto.payrollPeriodId,
          },
          select: {
            amount: true,
          },
        }),
      ]);

      const totalHoursWorked = attendances.reduce((acc, attendance) => {
        if (!attendance.checkOut) return acc;
        return (
          acc +
          (attendance.checkOut.getTime() - attendance.checkIn.getTime()) /
            (1000 * 60 * 60)
        );
      }, 0);

      const totalOvertimeHours = overtimes.reduce((acc, overtime) => {
        return acc + overtime.hours;
      }, 0);

      const totalReimbursements = reimbursements.reduce(
        (acc, reimbursement) => {
          return acc + reimbursement.amount;
        },
        0,
      );

      const totalHoursPay = totalHoursWorked * employee.salary;

      const totalOvertimePay = totalOvertimeHours * employee.salary;

      const totalPay = totalHoursPay + totalOvertimePay + totalReimbursements;

      await this.payslipRepository.create({
        data: {
          userId: employee.id,
          payrollPeriodId: dto.payrollPeriodId,
          baseSalary: totalHoursPay,
          overtimePay: totalOvertimePay,
          reimbursements: totalReimbursements,
          totalPay,
        },
      });
    }

    await this.payrollPeriodRepository.markAsProcessed(dto.payrollPeriodId);
  }
}
