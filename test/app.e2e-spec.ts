import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { CreateReimbursementDto } from '@domain/dtos';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('End-to-End Flow', () => {
    let userId: string;
    let payrollPeriodId: string;

    it('should create a user and admin', async () => {
      const userResponse = await request(app.getHttpServer())
        .post('/users')
        .send({ name: 'Test User', role: 'USER' })
        .expect(201);
      userId = userResponse.body.id;

      const adminResponse = await request(app.getHttpServer())
        .post('/users')
        .send({ name: 'Test Admin', role: 'ADMIN' })
        .expect(201);
    });

    it('should create a payroll period', async () => {
      const payrollPeriodResponse = await request(app.getHttpServer())
        .post('/payroll-periods')
        .send({ startDate: '2023-01-01', endDate: '2023-01-31' })
        .expect(201);
      payrollPeriodId = payrollPeriodResponse.body.id;
    });

    it('should create attendance, overtime, and reimbursement', async () => {
      await request(app.getHttpServer())
        .post('/attendance')
        .send({ userId, payrollPeriodId, date: '2023-01-01', type: 'check-in' })
        .expect(201);

      await request(app.getHttpServer())
        .post('/overtime')
        .send({ userId, payrollPeriodId, hours: 2, date: '2023-01-01' })
        .expect(201);

      await request(app.getHttpServer())
        .post('/reimbursement')
        .send({ userId, payrollPeriodId, amount: 100, description: 'Test reimbursement' })
        .expect(201);
    });

    it('should process payroll', async () => {
      await request(app.getHttpServer())
        .post('/payroll/process')
        .send({ payrollPeriodId })
        .expect(200);
    });
  });
});
