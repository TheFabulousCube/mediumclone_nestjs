import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto, createUserSchema } from './../dto/createUser.dto';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { JoiValidationPipe } from './../validation.pipe';
import { UserResponseInterface } from '../types/userResponse.interface';
import { LoginUserDto, loginUserSchema } from '../dto/loginUser.dto';
import { ExpressRequest } from '../types/expressRequest.interface';
import { AuthGuard } from './guards/auth.guard';
import { UpdateUserDto, updateUserSchema } from '../dto/updateUser.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('user')
  @UseGuards(AuthGuard)
  async currentUser(
    @Req() request: ExpressRequest,
  ): Promise<UserResponseInterface> {
    return this.userService.buildUserResponse(request.user);
  }

  @Post('users')
  @UsePipes(new JoiValidationPipe(createUserSchema))
  async createUser(
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.createUser(createUserDto);
    return this.userService.buildUserResponse(user);
  }

  @Post('users/login')
  @UsePipes(new JoiValidationPipe(loginUserSchema))
  async loginUser(
    @Body('user') body: LoginUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.loginUser(body);
    return this.userService.buildUserResponse(user);
  }

  @Put('user')
  @UseGuards(AuthGuard)
  @UsePipes(new JoiValidationPipe(updateUserSchema))
  async updateCurrentUser(
    @Req() request: ExpressRequest,
    @Body('user') body: UpdateUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.updateUser(request.user?.id, body);
    return this.userService.buildUserResponse(user);
  }
}
