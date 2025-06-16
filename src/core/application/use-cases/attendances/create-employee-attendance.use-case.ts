import {
  IAttendanceRepository,
  IPayrollPeriodRepository,
  IUserRepository,
} from '@domain/repositories';
import { CreateEmployeeAttendanceDto } from '@domain/dtos';
import { Injectable } from '@nestjs/common';
import { BusinessException } from '@domain/exceptions';
import { isWeekend } from '@shared/utils';

@Injectable()
export class CreateEmployeeAttendanceUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly payrollPeriodRepository: IPayrollPeriodRepository,
    private readonly attendanceRepository: IAttendanceRepository,
  ) {}

  async execute(request: CreateEmployeeAttendanceDto) {
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

    const payrollPeriod = await this.payrollPeriodRepository.find({
      where: {
        id: request.payrollPeriodId,
      },
      select: {
        id: true,
      },
    });

    if (!payrollPeriod) {
      throw new BusinessException('Payroll period not found');
    }

    // make date to be the start of the day
    const startOfDay = new Date(request.date);
    startOfDay.setHours(0, 0, 0, 0);

    // check if the date is a weekend
    const isWeekendDay = isWeekend(startOfDay);
    if (isWeekendDay) {
      throw new BusinessException('Cannot submit attendance on weekends');
    }

    // check if the attendance already exists
    const attendance = await this.attendanceRepository.find({
      where: {
        userId: request.userId,
        date: { equals: startOfDay },
        payrollPeriodId: payrollPeriod.id,
      },
      select: {
        id: true,
      },
    });

    if (attendance) {
      if (request.type === 'check-in') {
        throw new BusinessException('Attendance already exists for this day');
      } else if (request.type === 'check-out') {
        await this.attendanceRepository.update({
          where: { id: attendance.id },
          data: { checkOut: new Date() },
        });
      }
      return {
        message: 'Attendance updated successfully',
      };
    }

    await this.attendanceRepository.create({
      data: {
        userId: request.userId,
        date: startOfDay,
        checkIn: new Date(),
        checkOut: new Date(),
        payrollPeriodId: payrollPeriod.id,
      },
    });

    return {
      message: 'Attendance created successfully',
    };
  }
}
