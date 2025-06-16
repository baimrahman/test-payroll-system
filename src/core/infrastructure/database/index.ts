import { Injectable, OnModuleDestroy, OnModuleInit, Global } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

export type DBTransaction = Prisma.TransactionClient;

@Global()
@Injectable()
export class Database
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleDestroy() {
    try {
      await this.$disconnect();
      console.log('Database disconnected');
    } catch (error) {
      console.log(error.message);
    }
  }
  async onModuleInit() {
    try {
      await this.$connect();
      console.log('Database initialized');
    } catch (error) {
      console.log(error.message);
    }
  }
}
