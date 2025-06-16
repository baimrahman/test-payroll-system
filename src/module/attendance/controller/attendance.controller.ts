import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateAttendanceRequestDto } from '../dtos/create-attendace-request.dto';
import { CreateEmployeeAttendanceUseCase } from '@application/use-cases/attendances';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '@domain/enums';

@Controller()
@ApiTags('Attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AttendanceController {
  constructor(
    private readonly createEmployeeAttendanceUseCase: CreateEmployeeAttendanceUseCase,
  ) {}

  @Post('/')
  @Roles(UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Create a new attendance' })
  @ApiBody({ type: CreateAttendanceRequestDto })
  @ApiResponse({ status: 201, description: 'Attendance created successfully' })
  async createAttendance(@Body() body: CreateAttendanceRequestDto) {
    return this.createEmployeeAttendanceUseCase.execute({
      userId: body.userId,
      payrollPeriodId: body.payrollPeriodId,
      type: body.type as 'check-in' | 'check-out',
    });
  }
}
