import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { CreateReimbursementRequestDto } from '../dtos/create-reimbursement-request.dto';
import { CreateReimbursementUseCase } from '@application/use-cases/reimbursement';

@Controller()
@ApiTags('Reimbursement')
export class ReimbursementController {
  constructor(
    private readonly createReimbursementUseCase: CreateReimbursementUseCase,
  ) {}

  @Post('/')
  @ApiOperation({ summary: 'Create a new reimbursement' })
  @ApiBody({ type: CreateReimbursementRequestDto })
  @ApiResponse({
    status: 201,
    description: 'Reimbursement created successfully',
  })
  async createReimbursement(@Body() body: CreateReimbursementRequestDto) {
    return this.createReimbursementUseCase.execute(body);
  }
}
