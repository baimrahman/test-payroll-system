import {
  IUserRepository,
  IOvertimeRepository,
  IPayrollPeriodRepository,
} from '@domain/repositories';
import { CreateOvertime } from '@domain/dtos';
import { Overtime } from '@domain/entities';
import { BusinessException } from '@domain/exceptions';
import { OvertimeStatus } from '@domain/enums';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateOvertimeUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly overtimeRepository: IOvertimeRepository,
    private readonly payrollPeriodRepository: IPayrollPeriodRepository,
  ) {}

  async execute(req: CreateOvertime): Promise<Overtime> {
    // check if user is exist
    const user = await this.userRepository.find({
      where: {
        id: req.userId,
      },
      select: {
        id: true,
      },
    });
    if (!user) {
      throw new BusinessException('User not found');
    }

    // check if payroll period is exist
    const payrollPeriod = await this.payrollPeriodRepository.find({
      where: {
        id: req.payrollPeriodId,
      },
      select: {
        id: true,
      },
    });
    if (!payrollPeriod) {
      throw new BusinessException('Payroll period not found');
    }

    // get all overtime of the user in the payroll period
    const overtimes = await this.overtimeRepository.findAll({
      where: {
        userId: req.userId,
        payrollPeriodId: req.payrollPeriodId,
        date: {
          gte: req.date,
          lte: req.date,
        },
      },
      select: {
        hours: true,
      },
    });

    const totalOvertimeHours = overtimes.reduce(
      (acc, overtime) => acc + overtime.hours,
      0,
    );

    // check if hour is more than 3 hours
    if (totalOvertimeHours + req.hours > 3) {
      throw new BusinessException(
        'Overtime hours must be less or equal to 3 hours',
      );
    }

    // create overtime
    const newOvertime = await this.overtimeRepository.create({
      data: {
        userId: req.userId,
        date: req.date,
        hours: req.hours,
        status: OvertimeStatus.PENDING,
        payrollPeriodId: req.payrollPeriodId,
      },
    });

    return newOvertime;
  }
}
