import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  Req,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from '../dtos/register.dto';
import { RegisterUseCase } from '../use-cases/register.use-case';
import { LoginUseCase } from '../use-cases/login.use-case';
import { LoginDto } from '../dtos/login.dto';
import { Response } from 'express';
import { JwtGuard } from '../guards/jwt.guard';
import { Request as ExpressRequest } from 'express';
import { SendOtpUseCase } from '../use-cases/send-otp.use-case';
import { VerifyOtpUseCase } from '../use-cases/verify-otp.use-case';
import { ForgotPasswordUseCase } from '../use-cases/forgot-password.use-case';
import { ResetPasswordUseCase } from '../use-cases/reset-password.use-case';
import { SendOtpDto } from '../dtos/send-otp.dto';
import { VerifyOtpDto } from '../dtos/verify-otp.dto';
import { ForgotPasswordDto } from '../dtos/forgot-password.dto';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { IAuthRepository } from '../repositories/auth.repository';
import { IAuthRepositoryToken } from 'src/constants/auth.tokens';
import { RefreshTokenUseCase } from '../use-cases/refresh-token.use-case';
import { CookieRequest } from 'src/shared/constants/express-cookie-request.interface';
import { AuthMessages } from 'src/constants/messages.constant';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly sendOtpUseCase: SendOtpUseCase,
    private readonly verifyOtpUseCase: VerifyOtpUseCase,
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    @Inject(IAuthRepositoryToken)
    private readonly authRepository: IAuthRepository,
  ) {}

  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log('the backend respose get in forntet for register:', dto);
    const result = await this.registerUseCase.execute(dto);

    res.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return {
      accessToken: result.accessToken,
      user: result.user,
    };
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.loginUseCase.execute(dto);

    res.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return {
      accessToken: result.accessToken,
      user: result.user,
    };
  }

  @Post('send-otp')
  sendOtp(@Body() dto: SendOtpDto) {
    return this.sendOtpUseCase.execute(dto);
  }

  @Post('verify-otp')
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.verifyOtpUseCase.execute(dto);
  }

  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.forgotPasswordUseCase.execute(dto.email);
  }

  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.resetPasswordUseCase.execute(dto);
  }

  @UseGuards(JwtGuard)
  @Post('logout')
  async logout(
    @Req() req: ExpressRequest & { user: { userId: string } },
    @Res() res: Response,
  ) {
    const user = req.user;
    await this.authRepository.clearRefreshToken(user.userId);
    res.clearCookie('refresh_token');
    return res.json({ message: AuthMessages.LOGOUT_SUCCESS });
  }

  @Post('refresh-token')
  async refreshAccessToken(
    @Req() req: CookieRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      throw new UnauthorizedException(AuthMessages.REFRESH_TOKEN_MISSING);
    }

    const result = await this.refreshTokenUseCase.execute(refreshToken);

    res.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      accessToken: result.accessToken,
      user: result.user,
    };
  }
}
