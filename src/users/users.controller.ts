import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { CreateUserResponseDto } from './dto/create-user.response.dto.js';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Criação de usuario' })
  @ApiResponse({
    status: 200,
    description: 'Usuário criado com sucesso',
    type: CreateUserResponseDto,
  })
  createUser(@Body() data: CreateUserDto) {
    return this.userService.create(data);
  }
}
