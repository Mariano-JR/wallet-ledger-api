import { ApiProperty } from '@nestjs/swagger';

export class GetBalanceResponseDto {
  @ApiProperty({ example: 'w1' })
  walletId!: string;

  @ApiProperty({ example: 100.5 })
  brlBalance!: number;

  @ApiProperty({ example: 0.01 })
  btcBalance!: number;

  @ApiProperty({ example: 2.5 })
  ethBalance!: number;
}
