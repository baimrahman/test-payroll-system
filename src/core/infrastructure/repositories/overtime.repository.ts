import { Overtime } from '@domain/entities';
import { IOvertimeRepository } from '@domain/repositories';
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
export class OvertimeRepository implements IOvertimeRepository {
  constructor(private readonly db: Database) {}

  async create(
    req: CreateRequest<Overtime>,
    tx?: DBTransaction,
  ): Promise<Overtime> {
    return (await (tx ?? this.db).overtime.create({
      data: req.data,
    })) as Overtime;
  }

  async find<Req extends FindRequest<Overtime>>(
    req: Req,
    tx?: DBTransaction,
  ): Promise<SelectedFields<Overtime, Req['select']> | null> {
    return (await (tx ?? this.db).overtime.findFirst({
      select: req.select,
      where: req.where,
      orderBy: req.orderBy,
      skip: req.skip,
      take: req.take,
    })) as SelectedFields<Overtime, Req['select']>;
  }

  async findAll<Req extends FindAllRequest<Overtime>>(
    req: Req,
    tx?: DBTransaction,
  ): Promise<SelectedFields<Overtime, Req['select']>[]> {
    return (await (tx ?? this.db).overtime.findMany({
      select: req.select,
      where: req.where,
      orderBy: req.orderBy,
      skip: req.skip,
      take: req.take,
    })) as SelectedFields<Overtime, Req['select']>[];
  }

  async update(
    req: UpdateRequest<Overtime>,
    tx?: DBTransaction,
  ): Promise<void> {
    await (tx ?? this.db).overtime.update({ where: req.where, data: req.data });
  }

  delete(req: DeleteRequest<Overtime>, tx?: DBTransaction): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
