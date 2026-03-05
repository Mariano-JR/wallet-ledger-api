import { ApiProperty } from '@nestjs/swagger';

export class LoginUserResponseDto {
  @ApiProperty({ example: 'hash-access-token-string' })
  accessToken!: string;

  @ApiProperty({ example: 'hash-refresh-token-string' })
  refreshToken!: string;
}
