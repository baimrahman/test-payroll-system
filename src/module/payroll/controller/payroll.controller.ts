import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { ProcessPayrollUseCase } from '@application/use-cases/payroll/process-payroll.use-case';
import { ProcessPayrollRequest } from '../dtos/process-payroll-request';

@Controller()
@ApiTags('Payroll')
export class PayrollController {
  constructor(private readonly processPayrollUseCase: ProcessPayrollUseCase) {}

  @Post('/')
  @ApiOperation({ summary: 'Process payroll' })
  @ApiBody({ type: ProcessPayrollRequest })
  @ApiResponse({ status: 201, description: 'Payroll processed successfully' })
  async processPayroll(@Body() body: ProcessPayrollRequest) {
    return this.processPayrollUseCase.execute(body);
  }
}
