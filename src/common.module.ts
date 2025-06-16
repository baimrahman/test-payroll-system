import { Global, Module } from '@nestjs/common';
import { Database } from '@infrastructure/database';

@Global()
@Module({
  providers: [Database],
  exports: [Database],
})
export class CommonModule {} 