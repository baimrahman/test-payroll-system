import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProcessPayrollRequestDto } from '../dtos/process-payroll-request.dto';
import { ProcessPayrollUseCase } from '@application/use-cases/payroll/process-payroll.use-case';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '@domain/enums';

@Controller()
@ApiTags('Payroll')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PayrollController {
  constructor(
    private readonly processPayrollUseCase: ProcessPayrollUseCase,
  ) {}

  @Post('/')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Process payroll' })
  @ApiBody({ type: ProcessPayrollRequestDto })
  @ApiResponse({ status: 201, description: 'Payroll processed successfully' })
  async processPayroll(@Body() body: ProcessPayrollRequestDto) {
    return this.processPayrollUseCase.execute(body);
  }
}
