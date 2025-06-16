import { Reimbursement } from '@domain/entities';
import { IReimbursementRepository } from '@domain/repositories';
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
export class ReimbursementRepository implements IReimbursementRepository {
  constructor(private readonly db: Database) {}

  async create(
    req: CreateRequest<Reimbursement>,
    tx?: DBTransaction,
  ): Promise<Reimbursement> {
    return (await (tx ?? this.db).reimbursement.create({
      data: req.data,
    })) as Reimbursement;
  }

  async find<Req extends FindRequest<Reimbursement>>(
    req: Req,
    tx?: DBTransaction,
  ): Promise<SelectedFields<Reimbursement, Req['select']> | null> {
    return (await (tx ?? this.db).reimbursement.findFirst({
      select: req.select,
      where: req.where,
      orderBy: req.orderBy,
      skip: req.skip,
      take: req.take,
    })) as unknown as SelectedFields<Reimbursement, Req['select']>;
  }

  async findAll<Req extends FindAllRequest<Reimbursement>>(
    req: Req,
    tx?: DBTransaction,
  ): Promise<SelectedFields<Reimbursement, Req['select']>[]> {
    return (await (tx ?? this.db).reimbursement.findMany({
      select: req.select,
      where: req.where,
      orderBy: req.orderBy,
      skip: req.skip,
      take: req.take,
    })) as unknown as SelectedFields<Reimbursement, Req['select']>[];
  }

  async update(
    req: UpdateRequest<Reimbursement>,
    tx?: DBTransaction,
  ): Promise<void> {
    await (tx ?? this.db).reimbursement.update({
      where: req.where,
      data: req.data,
    });
  }

  delete(req: DeleteRequest<Reimbursement>, tx?: DBTransaction): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
