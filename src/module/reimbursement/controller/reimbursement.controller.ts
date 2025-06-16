import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateReimbursementRequestDto } from '../dtos/create-reimbursement-request.dto';
import { CreateReimbursementUseCase } from '@application/use-cases/reimbursement';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '@domain/enums';

@Controller()
@ApiTags('Reimbursement')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ReimbursementController {
  constructor(
    private readonly createReimbursementUseCase: CreateReimbursementUseCase,
  ) {}

  @Post('/')
  @Roles(UserRole.EMPLOYEE)
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
