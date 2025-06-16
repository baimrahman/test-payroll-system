import { Attendance } from '@domain/entities';
import { IAttendanceRepository } from '@domain/repositories';
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
export class AttendanceRepository implements IAttendanceRepository {
  constructor(private readonly db: Database) {}

  async create(
    req: CreateRequest<Attendance>,
    tx?: DBTransaction,
  ): Promise<Attendance> {
    return (await (tx ?? this.db).attendance.create({
      data: req.data,
    })) as Attendance;
  }

  async find<Req extends FindRequest<Attendance>>(
    req: Req,
    tx?: DBTransaction,
  ): Promise<SelectedFields<Attendance, Req['select']> | null> {
    return (await (tx ?? this.db).attendance.findFirst({
      select: req.select,
      where: req.where,
      orderBy: req.orderBy,
      skip: req.skip,
      take: req.take,
    })) as unknown as SelectedFields<Attendance, Req['select']>;
  }

  async findAll<Req extends FindAllRequest<Attendance>>(
    req: Req,
    tx?: DBTransaction,
  ): Promise<SelectedFields<Attendance, Req['select']>[]> {
    return (await (tx ?? this.db).attendance.findMany({
      select: req.select,
      where: req.where,
      orderBy: req.orderBy,
      skip: req.skip,
      take: req.take,
    })) as unknown as SelectedFields<Attendance, Req['select']>[];
  }

  async update(
    req: UpdateRequest<Attendance>,
    tx?: DBTransaction,
  ): Promise<void> {
    await (tx ?? this.db).attendance.update({
      where: req.where,
      data: req.data,
    });
  }

  delete(req: DeleteRequest<Attendance>, tx?: DBTransaction): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
