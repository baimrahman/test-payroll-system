import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ProcessPayrollRequestDto {
    @ApiProperty({
        description: 'The ID of the payroll period',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsNotEmpty()
    @IsString()
    payrollPeriodId: string;
}