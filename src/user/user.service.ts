import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dto/createUser.dto';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import { UserResponseInterface } from '../types/userResponse.interface';
import { LoginUserDto } from '../dto/loginUser.dto';
import { compare } from 'bcrypt';
import { UpdateUserDto } from '../dto/updateUser.dto';
import { error_messages } from '../utils/constants';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const userByEmail = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });
    const userByUsername = await this.userRepository.findOneBy({
      username: createUserDto.username,
    });
    if (userByEmail || userByUsername) {
      throw new HttpException(
        error_messages.USER_CONFLICT,
        HttpStatus.CONFLICT,
      );
    }
    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    return await this.userRepository.save(newUser);
  }

  async loginUser(creds: LoginUserDto): Promise<UserEntity> {
    const userByEmail = await this.userRepository.findOne({
      where: { email: creds.email },
      select: ['id', 'username', 'email', 'bio', 'image', 'password'],
    });
    if (!userByEmail) {
      throw new HttpException(
        error_messages.USER_NOT_FOUND,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const verified: Boolean = await verifyPassword(
      creds.password,
      userByEmail.password,
    );
    if (verified) {
      const newUser = new UserEntity();
      Object.assign(newUser, userByEmail);
      return await this.userRepository.save(newUser);
    } else {
      throw new HttpException(
        error_messages.PASSWORD_FAILURE,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async updateUser(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const user = await this.getUserById(userId);
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  generateJwt(user: UserEntity): string {
    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      JWT_SECRET,
    );
  }

  buildUserResponse(user: UserEntity): UserResponseInterface {
    if (user === null) {
      throw new HttpException(
        error_messages.USER_UNAUTHORIZED,
        HttpStatus.FORBIDDEN,
      );
    }
    return user.toUserResponseInterface(this.generateJwt(user));
  }

  async getUserById(id: number): Promise<UserEntity> {
    return this.userRepository.findOneBy({ id: id });
  }
}
async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return await compare(password, hash);
}

function id(
  id: any,
  userId: number,
  info: UpdateUserDto,
): UserEntity | PromiseLike<UserEntity> {
  throw new Error('Function not implemented.');
}
