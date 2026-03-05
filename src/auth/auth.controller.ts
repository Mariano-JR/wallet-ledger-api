import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthLoginDto } from './dto/auth-login.dto.js';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginUserResponseDto } from './dto/user-create.response.dto.js';
import { RefreshTokenDto } from './dto/refresh-token.dto.js';
import { RefreshTokenResponseDto } from './dto/refresh.response.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Realiza login do usuário' })
  @ApiResponse({
    status: 201,
    description: 'Usuário logado com sucesso',
    type: LoginUserResponseDto,
  })
  authLogin(@Body() data: AuthLoginDto) {
    return this.authService.login(data);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Gera um novo Access Token' })
  @ApiResponse({
    status: 200,
    description: 'Access Token gerado com sucesso',
    type: RefreshTokenResponseDto,
  })
  refresh(@Body() data: RefreshTokenDto) {
    return this.authService.refresh(data.refreshToken);
  }
}
