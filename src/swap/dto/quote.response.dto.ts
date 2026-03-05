import { ApiProperty } from '@nestjs/swagger';

export class QuoteResponseDto {
  @ApiProperty({ example: 32.247084251 })
  quantidadeDeDestinoEstimada!: number;

  @ApiProperty({ example: 0.015 })
  taxaDeConversao!: number;

  @ApiProperty({ example: '2026-03-05T13:35:18.020Z' })
  cotacaoUsada!: Date;
}
