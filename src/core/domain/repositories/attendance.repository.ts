import { Attendance } from '@domain/entities';
import { IBaseRepository } from './base.repository';

export abstract class IAttendanceRepository extends IBaseRepository<Attendance> { }