// create a e2e test for the app

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaClient, UserRole } from '@prisma/client';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaClient;
  let testUserId: string;
  let testPayrollPeriodId: string;
  let formattedDate: string;
  let employeeToken: string;
  let adminToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Initialize Prisma client and clean up database
    prisma = new PrismaClient();
    await prisma.attendance.deleteMany();
    await prisma.overtime.deleteMany();
    await prisma.reimbursement.deleteMany();
    await prisma.payslip.deleteMany();
    await prisma.payrollPeriod.deleteMany();
    await prisma.user.deleteMany();

    // Create test user
    const user = await prisma.user.create({
      data: {
        username: 'test',
        password: 'test',
        role: UserRole.EMPLOYEE,
        salary: 1000,
      },
    });

    testUserId = user.id;

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        username: 'admin',
        password: 'admin',
        role: UserRole.ADMIN,
        salary: 1000,
      },
    });

    // Get tokens
    const employeeLoginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'test',
        password: 'test',
      });
    employeeToken = employeeLoginResponse.body.access_token;

    const adminLoginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'admin',
        password: 'admin',
      });
    adminToken = adminLoginResponse.body.access_token;

    // Set up the test date
    const attendanceDate = new Date('2024-03-04');
    formattedDate = attendanceDate.toISOString().split('T')[0];
  });

  afterAll(async () => {
    // Clean up in reverse order of dependencies
    await prisma.attendance.deleteMany();
    await prisma.overtime.deleteMany();
    await prisma.reimbursement.deleteMany();
    await prisma.payslip.deleteMany();
    await prisma.payrollPeriod.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
    await app.close();
  });

  // create payroll period using api
  it('should create payroll period using api', async () => {
    const response = await request(app.getHttpServer())
      .post('/payroll-period')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        startDate: new Date('2024-03-01').toISOString(),
        endDate: new Date('2024-03-31').toISOString(),
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('startDate');
    expect(response.body).toHaveProperty('endDate');

    testPayrollPeriodId = response.body.id;
  });

  // create attendance using api
  it('should create attendance using api', async () => {
    const response = await request(app.getHttpServer())
      .post('/attendance')
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({
        userId: testUserId,
        date: formattedDate,
        type: 'check-in',
        payrollPeriodId: testPayrollPeriodId,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Attendance created successfully');
  });

  // make attendance check-out using api
  it('should make attendance check-out using api', async () => {
    const response = await request(app.getHttpServer())
      .post('/attendance')
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({
        userId: testUserId,
        date: formattedDate,
        type: 'check-out',
        payrollPeriodId: testPayrollPeriodId,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Attendance updated successfully');
  });

  // create overtime using api
  it('should create overtime using api', async () => {
    const response = await request(app.getHttpServer())
      .post('/overtime')
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({
        userId: testUserId,
        date: new Date(formattedDate).toISOString(),
        hours: 1,
        payrollPeriodId: testPayrollPeriodId,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('userId', testUserId);
    expect(response.body).toHaveProperty('hours', 1);
    expect(response.body).toHaveProperty('status', 'PENDING');
    expect(response.body).toHaveProperty('payrollPeriodId', testPayrollPeriodId);
  });

  // create reimbursement using api
  it('should create reimbursement using api', async () => {
    const response = await request(app.getHttpServer())
      .post('/reimbursement')
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({
        userId: testUserId,
        amount: 100,
        description: 'Test reimbursement',
        payrollPeriodId: testPayrollPeriodId,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('userId', testUserId);
    expect(response.body).toHaveProperty('amount', 100);
    expect(response.body).toHaveProperty('description', 'Test reimbursement');
    expect(response.body).toHaveProperty('status', 'PENDING');
    expect(response.body).toHaveProperty('payrollPeriodId', testPayrollPeriodId);
  });

  // process payroll using api
  it('should process payroll using api', async () => {
    const response = await request(app.getHttpServer())
      .post('/payroll')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        payrollPeriodId: testPayrollPeriodId,
      });
    
    expect(response.status).toBe(201);
    expect(response.body).toEqual({});
  });
});