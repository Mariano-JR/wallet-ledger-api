import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { SwapService } from './swap.service.js';
import { SwapDto } from './dto/swap.dto.js';
import type { Request } from 'express';
import { AppError } from '../common/errors/app.error.js';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { QuoteResponseDto } from './dto/quote.response.dto.js';
import { SwapResponseDto } from './dto/swap.response.dto.js';

@ApiTags('Swap')
@Controller('swap')
export class SwapController {
  constructor(private readonly swapService: SwapService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Converte valores entre tokens da carteira' })
  @ApiResponse({
    status: 201,
    description: 'Conversão concluida com sucesso',
    type: SwapResponseDto,
  })
  async swap(@Req() req: Request, @Body() data: SwapDto) {
    const userId = req.user!.sub;

    if (!userId) {
      throw new AppError('Usuario não logado', 401);
    }

    return this.swapService.swap(userId, data);
  }

  @Get('quote')
  @ApiOperation({
    summary: 'Realiza cotação de conversão de valores entre tokens',
  })
  @ApiResponse({
    status: 200,
    description: 'Cotação validada',
    type: QuoteResponseDto,
  })
  async getQuote(@Query() data: SwapDto) {
    return this.swapService.getQuote(data);
  }
}
