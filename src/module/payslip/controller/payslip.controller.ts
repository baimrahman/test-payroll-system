import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { GetPayslipEmployeeUseCase } from '@application/use-cases/payslip/get-payslip-employee.use-case';
import { GetPayslipRequestDto } from '../dtos/get-payslip-request.dto';
import { GetPayslipResponseDto } from '../dtos/get-payslip-response.dto';
import { JwtAuthGuard } from '../../../module/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../module/auth/guards/roles.guard';
import { Roles } from '../../../module/auth/decorators/roles.decorator';
import { UserRole } from '@domain/enums';

@Controller()
@ApiTags('Payslip')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.EMPLOYEE)
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
