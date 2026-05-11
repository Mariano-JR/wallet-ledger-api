import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { AuthLoginDto } from './dto/auth-login.dto.js';
import { AppError } from '../common/errors/app.error.js';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async login({ email, password }: AuthLoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        userId: true,
        email: true,
        password: true,
      },
    });

    if (!user) {
      throw new AppError('Email ou senha inválidos', 401);
    }

    const decryptedPassword = await bcrypt.compare(password, user.password);

    if (!decryptedPassword) {
      throw new AppError('Email ou senha inválidos', 401);
    }

    const tokens = this.gerenateTokens(user.userId, user.email);

    return tokens;
  }

  private gerenateTokens(userId: string, email: string) {
    const jwtAccessSecret = process.env.JWT_ACCESS_SECRET;
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

    if (!jwtAccessSecret || !jwtRefreshSecret) {
      throw new Error('JWT Secret not found');
    }

    const payload = {
      sub: userId,
      email: email,
    };

    const accessToken = jwt.sign(payload, jwtAccessSecret, {
      expiresIn: '15m',
    });

    const refreshToken = jwt.sign(payload, jwtRefreshSecret, {
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  refresh(refreshToken: string) {
    const jwtAccessSecret = process.env.JWT_ACCESS_SECRET;
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

    if (!jwtAccessSecret || !jwtRefreshSecret) {
      throw new Error('JWT Secret not found');
    }

    const payload = jwt.verify(refreshToken, jwtRefreshSecret);

    const accessToken = jwt.sign({ sub: payload.sub }, jwtAccessSecret, {
      expiresIn: '15m',
    });

    return { accessToken };
  }
}
