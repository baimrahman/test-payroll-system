import { PayrollPeriod } from '@domain/entities';
import { IPayrollPeriodRepository } from '@domain/repositories';
import { Database, DBTransaction } from '@infrastructure/database';
import {
  CreateRequest,
  FindRequest,
  FindAllRequest,
  UpdateRequest,
  DeleteRequest,
  SelectedFields,
} from '@domain/repositories/base.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PayrollPeriodRepository implements IPayrollPeriodRepository {
  constructor(private readonly db: Database) {}

  async create(
    req: CreateRequest<PayrollPeriod>,
    tx?: DBTransaction,
  ): Promise<PayrollPeriod> {
    return (await (tx ?? this.db).payrollPeriod.create({
      data: req.data,
    })) as PayrollPeriod;
  }

  async find<Req extends FindRequest<PayrollPeriod>>(
    req: Req,
    tx?: DBTransaction,
  ): Promise<SelectedFields<PayrollPeriod, Req['select']> | null> {
    return (await (tx ?? this.db).payrollPeriod.findFirst({
      select: req.select,
      where: req.where,
      orderBy: req.orderBy,
      skip: req.skip,
      take: req.take,
    })) as SelectedFields<PayrollPeriod, Req['select']>;
  }

  async findAll<Req extends FindAllRequest<PayrollPeriod>>(
    req: Req,
    tx?: DBTransaction,
  ): Promise<SelectedFields<PayrollPeriod, Req['select']>[]> {
    return (await (tx ?? this.db).payrollPeriod.findMany({
      select: req.select,
      where: req.where,
      orderBy: req.orderBy,
      skip: req.skip,
      take: req.take,
    })) as SelectedFields<PayrollPeriod, Req['select']>[];
  }

  async update(
    req: UpdateRequest<PayrollPeriod>,
    tx?: DBTransaction,
  ): Promise<void> {
    await (tx ?? this.db).payrollPeriod.update({
      where: req.where,
      data: req.data,
    });
  }

  delete(req: DeleteRequest<PayrollPeriod>, tx?: DBTransaction): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async markAsProcessed(payrollPeriodId: string): Promise<void> {
    await this.db.payrollPeriod.update({
      where: { id: payrollPeriodId },
      data: { status: 'PROCESSED' },
    });
  }
}
