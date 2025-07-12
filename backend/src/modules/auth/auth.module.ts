import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { RegisterUseCase } from './use-cases/register.use-case';
import { LoginUseCase } from './use-cases/login.use-case';
import { HashUtil } from '../../shared/utils/hash.util';
import { TokenService } from './services/token.service';
import { PrismaAuthRepository } from './infra/prisma-auth.repository';
import { PrismaModule } from '../../database/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/config/jwt.config';
import { IAuthRepositoryToken } from 'src/constants/auth.tokens';
import { SendOtpUseCase } from './use-cases/send-otp.use-case';
import { VerifyOtpUseCase } from './use-cases/verify-otp.use-case';
import { ForgotPasswordUseCase } from './use-cases/forgot-password.use-case';
import { ResetPasswordUseCase } from './use-cases/reset-password.use-case';
import { MailService } from './services/mail.service';
import { OtpService } from './services/otp.service';
import { RefreshTokenUseCase } from './use-cases/refresh-token.use-case';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [PrismaModule, PassportModule, JwtModule.registerAsync(jwtConfig)],
  controllers: [AuthController],
  providers: [
    RegisterUseCase,
    LoginUseCase,
    SendOtpUseCase,
    VerifyOtpUseCase,
    ForgotPasswordUseCase,
    ResetPasswordUseCase,
    RefreshTokenUseCase,
    HashUtil,
    MailService,
    OtpService,
    TokenService,
    JwtStrategy,
    {
      provide: IAuthRepositoryToken,
      useClass: PrismaAuthRepository,
    },
  ],
})
export class AuthModule {}
