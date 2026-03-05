import { ApiProperty } from '@nestjs/swagger';

export class SwapResponseDto {
  @ApiProperty({ example: 'Conversão concluida com sucesso' })
  message!: string;
}
