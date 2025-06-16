import { Overtime } from '@domain/entities';
import { IBaseRepository } from './base.repository';

export abstract class IOvertimeRepository extends IBaseRepository<Overtime> { }