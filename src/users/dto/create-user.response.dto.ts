import { ApiProperty } from '@nestjs/swagger';

export class CreateUserResponseDto {
  @ApiProperty({ example: 'uuid-string' })
  userId!: string;

  @ApiProperty({ example: 'johndoe@gmail.com' })
  email!: string;
}
