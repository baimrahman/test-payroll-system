import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { CreateAttendanceRequestDto } from '../dtos/create-attendace-request.dto';
import { CreateEmployeeAttendanceUseCase } from '@application/use-cases/attendances';

@Controller()
@ApiTags('Attendance')
export class AttendanceController {
  constructor(
    private readonly createEmployeeAttendanceUseCase: CreateEmployeeAttendanceUseCase,
  ) {}

  @Post('/')
  @ApiOperation({ summary: 'Create a new attendance' })
  @ApiBody({ type: CreateAttendanceRequestDto })
  @ApiResponse({ status: 201, description: 'Attendance created successfully' })
  async createAttendance(@Body() body: CreateAttendanceRequestDto) {
    return this.createEmployeeAttendanceUseCase.execute({
      userId: body.userId,
      date: body.date,
      payrollPeriodId: body.payrollPeriodId,
      type: body.type as 'check-in' | 'check-out',
    });
  }
}
