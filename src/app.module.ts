import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './shared/config/winston.config';
import { RouterModule } from '@nestjs/core';
import { CommonModule } from './common.module';

import { PayrollPeriodModule } from './module/payroll-period/payroll-period.module';
import { AttendanceModule } from './module/attendance/attendance.module';
import { OvertimeModule } from './module/overtime/overtime.module';
import { ReimbursementModule } from './module/reimbursement/reimbursement.module';
import { PayrollModule } from './module/payroll/payroll.module';
import { PayslipModule } from './module/payslip/payslip.module';
import { AuthModule } from './module/auth/auth.module';

@Module({
  imports: [
    CommonModule,
    AuthModule,
    PayrollPeriodModule,
    AttendanceModule,
    OvertimeModule,
    ReimbursementModule,
    PayrollModule,
    PayslipModule,
    RouterModule.register([
      {
        path: 'auth',
        module: AuthModule,
      },
      {
        path: 'payroll-period',
        module: PayrollPeriodModule,
      },
      {
        path: 'attendance',
        module: AttendanceModule,
      },
      {
        path: 'overtime',
        module: OvertimeModule,
      },
      {
        path: 'reimbursement',
        module: ReimbursementModule,
      },
      {
        path: 'payroll',
        module: PayrollModule,
      },
      {
        path: 'payslip',
        module: PayslipModule,
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WinstonModule.forRoot(winstonConfig),
  ],
})
export class AppModule {}
