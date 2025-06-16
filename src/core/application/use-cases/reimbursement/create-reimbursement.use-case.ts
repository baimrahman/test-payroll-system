import {
  IUserRepository,
  IReimbursementRepository,
  IPayrollPeriodRepository,
} from '@domain/repositories';
import { CreateReimbursementDto } from '@domain/dtos';
import { BusinessException } from '@domain/exceptions';
import { ReimbursementStatus } from '@domain/enums';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateReimbursementUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly reimbursementRepository: IReimbursementRepository,
    private readonly payrollPeriodRepository: IPayrollPeriodRepository,
  ) {}

  async execute(dto: CreateReimbursementDto) {
    const user = await this.userRepository.find({
      where: {
        id: dto.userId,
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
        id: dto.payrollPeriodId,
      },
      select: {
        id: true,
      },
    });

    if (!payrollPeriod) {
      throw new BusinessException('Payroll period not found');
    }

    const reimbursement = await this.reimbursementRepository.create({
      data: {
        userId: dto.userId,
        amount: dto.amount,
        description: dto.description,
        payrollPeriodId: payrollPeriod.id,
        status: ReimbursementStatus.PENDING,
      },
    });

    return reimbursement;
  }
}
