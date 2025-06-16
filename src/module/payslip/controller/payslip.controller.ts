import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { GetPayslipEmployeeUseCase } from '@application/use-cases/payslip/get-payslip-employee.use-case';
import { GetPayslipRequestDto } from '../dtos/get-payslip-request.dto';
import { GetPayslipResponseDto } from '../dtos/get-payslip-response.dto';

@Controller()
@ApiTags('Payslip')
export class PayslipController {
  constructor(private readonly getPayslipEmployeeUseCase: GetPayslipEmployeeUseCase) {}

  @Get('/')
  @ApiOperation({ summary: 'Get payslip' })
  @ApiBody({ type: GetPayslipRequestDto })
  @ApiResponse({ status: 201, description: 'Payslip retrieved successfully' })
  async getPayslip(@Query() query: GetPayslipRequestDto): Promise<GetPayslipResponseDto> {
    return this.getPayslipEmployeeUseCase.execute(query);
  }
}
