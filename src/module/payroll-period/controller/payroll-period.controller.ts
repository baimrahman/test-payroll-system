import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreatePayrollPeriodRequestDto } from '../dtos/create-payroll-period-request.dto';
import { CreatePayrollPeriodUseCase } from '@application/use-cases/payroll-periods/create-payroll-period.use-case';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '@domain/enums';

@Controller()
@ApiTags('Payroll Period')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PayrollPeriodController {
  constructor(
    private readonly createPayrollPeriodUseCase: CreatePayrollPeriodUseCase,
  ) {}

  @Post('/')
  @Roles(UserRole.ADMIN)
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
