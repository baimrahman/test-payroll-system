import { User } from '@domain/entities';

import { IUserRepository } from '@domain/repositories';
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
export class UserRepository implements IUserRepository {
  constructor(private readonly db: Database) {}

  async create(req: CreateRequest<User>, tx?: DBTransaction): Promise<User> {
    return (await (tx ?? this.db).user.create({
      data: req.data,
    })) as User;
  }

  async find<Req extends FindRequest<User>>(
    req: Req,
    tx?: DBTransaction,
  ): Promise<SelectedFields<User, Req['select']> | null> {
    return (await (tx ?? this.db).user.findFirst({
      select: req.select,
      where: req.where,
      orderBy: req.orderBy,
      skip: req.skip,
      take: req.take,
    })) as SelectedFields<User, Req['select']>;
  }

  async findAll<Req extends FindAllRequest<User>>(
    req: Req,
    tx?: DBTransaction,
  ): Promise<SelectedFields<User, Req['select']>[]> {
    return (await (tx ?? this.db).user.findMany({
      select: req.select,
      where: req.where,
      orderBy: req.orderBy,
      skip: req.skip,
      take: req.take,
    })) as SelectedFields<User, Req['select']>[];
  }

  async update(req: UpdateRequest<User>, tx?: DBTransaction): Promise<void> {
    await (tx ?? this.db).user.update({ where: req.where, data: req.data });
  }

  delete(req: DeleteRequest<User>, tx?: DBTransaction): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
