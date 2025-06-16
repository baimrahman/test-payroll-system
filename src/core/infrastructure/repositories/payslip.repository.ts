import { Payslip } from '@domain/entities';
import { IPayslipRepository } from '@domain/repositories';
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
export class PayslipRepository implements IPayslipRepository {
  constructor(private readonly db: Database) {}

  async create(
    req: CreateRequest<Payslip>,
    tx?: DBTransaction,
  ): Promise<Payslip> {
    return (await (tx ?? this.db).payslip.create({
      data: req.data,
    })) as Payslip;
  }

  async find<Req extends FindRequest<Payslip>>(
    req: Req,
    tx?: DBTransaction,
  ): Promise<SelectedFields<Payslip, Req['select']> | null> {
    return (await (tx ?? this.db).payslip.findFirst({
      select: req.select,
      where: req.where,
      orderBy: req.orderBy,
      skip: req.skip,
      take: req.take,
    })) as SelectedFields<Payslip, Req['select']>;
  }

  async findAll<Req extends FindAllRequest<Payslip>>(
    req: Req,
    tx?: DBTransaction,
  ): Promise<SelectedFields<Payslip, Req['select']>[]> {
    return (await (tx ?? this.db).payslip.findMany({
      select: req.select,
      where: req.where,
      orderBy: req.orderBy,
      skip: req.skip,
      take: req.take,
    })) as SelectedFields<Payslip, Req['select']>[];
  }

  async update(req: UpdateRequest<Payslip>, tx?: DBTransaction): Promise<void> {
    throw new Error('Method not implemented.');
  }

  delete(req: DeleteRequest<Payslip>, tx?: DBTransaction): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
