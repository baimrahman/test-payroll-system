import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { CreateOvertimeRequestDto } from '../dtos/create-overtime-request.dto';
import { CreateOvertimeUseCase } from '@application/use-cases/overtime';

@Controller()
@ApiTags('Overtime')
export class OvertimeController {
  constructor(private readonly createOvertimeUseCase: CreateOvertimeUseCase) {}

  @Post('/')
  @ApiOperation({ summary: 'Create a new overtime' })
  @ApiBody({ type: CreateOvertimeRequestDto })
  @ApiResponse({ status: 201, description: 'Overtime created successfully' })
  async createOvertime(@Body() body: CreateOvertimeRequestDto) {
    return this.createOvertimeUseCase.execute(body);
  }
}
