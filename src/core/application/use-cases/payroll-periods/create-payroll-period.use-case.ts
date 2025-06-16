import { PayrollPeriod } from '@domain/entities';
import { IPayrollPeriodRepository } from '@domain/repositories';
import { PayrollStatus } from '@domain/enums';
import { CreatePayrollPeriodDto } from '@domain/dtos';
import { Injectable } from '@nestjs/common';
import { BusinessException } from '@domain/exceptions';

@Injectable()
export class CreatePayrollPeriodUseCase {
  constructor(private readonly payrollPeriodRepository: IPayrollPeriodRepository) {}

  async execute(request: CreatePayrollPeriodDto): Promise<PayrollPeriod> {
    // Validate dates
    if (request.startDate >= request.endDate) {
      throw new BusinessException('Start date must be before end date');
    }

    // Check if payroll period already exists
    const existingPayrollPeriod = await this.payrollPeriodRepository.find({
      where: {
        startDate: {
          lte: request.endDate
        },
        endDate: {
          gte: request.startDate
        }
      }
    });

    if (existingPayrollPeriod) {
      throw new BusinessException('Payroll period already exists');
    }

    // Create payroll period
    return await this.payrollPeriodRepository.create({
      data: {
        startDate: request.startDate,
        endDate: request.endDate,
        status: PayrollStatus.PENDING,
      }
    });
  }
} 