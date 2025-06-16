import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { ProcessPayrollUseCase } from '@application/use-cases/payroll/process-payroll.use-case';
import { ProcessPayrollRequestDto } from '../dtos/process-payroll-request.dto';

@Controller()
@ApiTags('Payroll')
export class PayrollController {
  constructor(private readonly processPayrollUseCase: ProcessPayrollUseCase) {}

  @Post('/')
  @ApiOperation({ summary: 'Process payroll' })
  @ApiBody({ type: ProcessPayrollRequestDto })
  @ApiResponse({ status: 201, description: 'Payroll processed successfully' })
  async processPayroll(@Body() body: ProcessPayrollRequestDto) {
    return this.processPayrollUseCase.execute(body);
  }
}
