import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { IUserRepository } from '@domain/repositories';
import { UserRepository } from '@infrastructure/repositories';
import { HashService } from '@infrastructure/services/hash.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
    {
      provide: 'IHashService',
      useClass: HashService,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {} 