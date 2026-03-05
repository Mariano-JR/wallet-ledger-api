import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenResponseDto {
  @ApiProperty({ example: 'hash-access-token-string' })
  accessToken!: string;
}
