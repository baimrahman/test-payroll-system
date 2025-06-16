import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateOvertimeRequestDto } from '../dtos/create-overtime-request.dto';
import { CreateOvertimeUseCase } from '@application/use-cases/overtime';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '@domain/enums';

@Controller()
@ApiTags('Overtime')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class OvertimeController {
  constructor(
    private readonly createOvertimeUseCase: CreateOvertimeUseCase,
  ) {}

  @Post('/')
  @Roles(UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Create a new overtime' })
  @ApiBody({ type: CreateOvertimeRequestDto })
  @ApiResponse({ status: 201, description: 'Overtime created successfully' })
  async createOvertime(@Body() body: CreateOvertimeRequestDto) {
    return this.createOvertimeUseCase.execute(body);
  }
}
