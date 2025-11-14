import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as bcrypt from 'bcrypt';
import { EmailService } from '../email/email.service';
import { randomBytes, createHash } from 'crypto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  private static readonly VERIFICATION_WINDOW_MS = 15 * 60 * 1000;
  private static readonly PASSWORD_RESET_WINDOW_MS = 30 * 60 * 1000;

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.userService.create({
      ...registerDto,
      password: hashedPassword,
      isEmailVerified: false,
    });

    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);

    // Send verification after issuing token so the user can proceed while waiting
    await this.assignNewVerificationCode(user);

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isEmailVerified: user.isEmailVerified,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isEmailVerified) {
      await this.ensureActiveVerificationCode(user);
    }

    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isEmailVerified: user.isEmailVerified,
      },
    };
  }

  async verifyEmail(verifyDto: VerifyEmailDto) {
    const user = await this.userService.findByEmail(verifyDto.email);
    if (!user) {
      throw new BadRequestException('Invalid verification request');
    }
    if (user.isEmailVerified) {
      return { message: 'Email is already verified.' };
    }
    if (
      !user.emailVerificationCode ||
      !user.emailVerificationCodeExpiresAt ||
      user.emailVerificationCodeExpiresAt.getTime() < Date.now()
    ) {
      await this.ensureActiveVerificationCode(user, true);
      throw new BadRequestException('Verification code expired. We sent you a new one.');
    }

    const submittedCodeHash = this.hashValue(verifyDto.code);
    if (submittedCodeHash !== user.emailVerificationCode) {
      throw new BadRequestException('Invalid verification code.');
    }

    user.isEmailVerified = true;
    user.emailVerificationCode = null;
    user.emailVerificationCodeExpiresAt = null;
    await this.userService.save(user);

    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isEmailVerified: user.isEmailVerified,
      },
    };
  }

  async resendVerification(resendDto: ResendVerificationDto) {
    const user = await this.userService.findByEmail(resendDto.email);
    if (!user) {
      return { message: 'If this email exists, a verification code has been re-sent.' };
    }
    if (user.isEmailVerified) {
      return { message: 'Email is already verified.' };
    }

    await this.assignNewVerificationCode(user);
    return { message: 'A new verification code has been sent.' };
  }

  async forgotPassword(forgotDto: ForgotPasswordDto) {
    const user = await this.userService.findByEmail(forgotDto.email);
    if (!user) {
      return { message: 'If this email exists, a reset link has been sent.' };
    }
    if (!user.isEmailVerified) {
      throw new BadRequestException('Verify your email before requesting a password reset.');
    }

    const token = this.generateResetToken();
    user.passwordResetToken = this.hashValue(token);
    user.passwordResetTokenExpiresAt = this.buildPasswordResetExpiry();
    await this.userService.save(user);

    await this.emailService.sendPasswordReset(user.email, token);

    return { message: 'Password reset link sent.' };
  }

  async resetPassword(resetDto: ResetPasswordDto) {
    const tokenHash = this.hashValue(resetDto.token);
    const user = await this.userService.findByPasswordResetToken(tokenHash);

    if (
      !user ||
      !user.passwordResetTokenExpiresAt ||
      user.passwordResetTokenExpiresAt.getTime() < Date.now()
    ) {
      throw new BadRequestException('Invalid or expired reset token.');
    }

    user.password = await bcrypt.hash(resetDto.password, 10);
    user.passwordResetToken = null;
    user.passwordResetTokenExpiresAt = null;
    await this.userService.save(user);

    return { message: 'Password updated successfully. You can now log in.' };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private generateResetToken(): string {
    return randomBytes(32).toString('hex');
  }

  private hashValue(value: string): string {
    return createHash('sha256').update(value).digest('hex');
  }

  private buildVerificationExpiry(): Date {
    return new Date(Date.now() + AuthService.VERIFICATION_WINDOW_MS);
  }

  private buildPasswordResetExpiry(): Date {
    return new Date(Date.now() + AuthService.PASSWORD_RESET_WINDOW_MS);
  }

  private async assignNewVerificationCode(
    user: User,
    options: { sendEmail?: boolean } = { sendEmail: true },
  ): Promise<string> {
    const code = this.generateVerificationCode();
    user.emailVerificationCode = this.hashValue(code);
    user.emailVerificationCodeExpiresAt = this.buildVerificationExpiry();
    await this.userService.save(user);
    if (options.sendEmail) {
      await this.emailService.sendEmailVerification(user.email, code);
    }
    return code;
  }

  private async ensureActiveVerificationCode(user: User, forceNew = false) {
    if (
      forceNew ||
      !user.emailVerificationCode ||
      !user.emailVerificationCodeExpiresAt ||
      user.emailVerificationCodeExpiresAt.getTime() < Date.now()
    ) {
      await this.assignNewVerificationCode(user);
    }
  }
}
