import { User } from '@domain/entities';
import { IBaseRepository } from './base.repository';

export abstract class IUserRepository extends IBaseRepository<User> {}