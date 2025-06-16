import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { CreatePayrollPeriodRequestDto } from '../dtos/create-payroll-period-request.dto';
import { CreatePayrollPeriodUseCase } from '@application/use-cases/payroll-periods';

@Controller()
@ApiTags('Payroll Period')
export class PayrollPeriodController {
  constructor(
    private readonly createPayrollPeriodUseCase: CreatePayrollPeriodUseCase,
  ) {}

  @Post('/')
  @ApiOperation({ summary: 'Create a new payroll period' })
  @ApiBody({ type: CreatePayrollPeriodRequestDto })
  @ApiResponse({
    status: 201,
    description: 'Payroll period created successfully',
  })
  async createPayrollPeriod(@Body() body: CreatePayrollPeriodRequestDto) {
    return this.createPayrollPeriodUseCase.execute(body);
  }
}
