import { Controller, Get, Query, Req } from '@nestjs/common';
import { LedgerService } from './ledger.service.js';
import type { Request } from 'express';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { LedgerReponseDto } from './dto/ledger.response.dto.js';

@ApiTags('Ledger')
@ApiBearerAuth()
@Controller('ledger')
export class LedgerController {
  constructor(private readonly ledgerService: LedgerService) {}

  @Get()
  @ApiOperation({ summary: 'Retorna o Ledger da carteira' })
  @ApiResponse({
    status: 200,
    description: 'Ledger retornado com sucesso',
    type: LedgerReponseDto,
  })
  async getLedger(
    @Req() req: Request,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    const userId = req.user!.sub;

    return await this.ledgerService.execute(userId, page, limit);
  }
}
