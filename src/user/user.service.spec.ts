import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import {
  JWTheader,
  mockCreateUserDTO,
  mockCreatedUser,
  mockExistingUser,
  mockExistingUserDTO,
  mockLoginUserDTO,
  mockResponse,
  mockUserEntity,
} from './mockUsers';
import * as bcryputils from 'bcrypt';
import { error_messages } from '../utils/constants';

export const mockUserRepository = {
  findOneBy: jest.fn((user: UserEntity) => {
    if (
      user.email == mockExistingUser.email ||
      user.username == mockExistingUser.username
    ) {
      return Promise.resolve(mockExistingUser);
    }
    return Promise.resolve(null);
  }),

  findOne: jest.fn((user: UserEntity) => {
    console.log('user passed in: ', user);
    if (user.email == mockExistingUser.email) {
      return Promise.resolve(mockExistingUser);
    } else {
      return Promise.resolve(null);
    }
  }),
  save: jest.fn((user: UserEntity) => {
    return Promise.resolve(user);
  }),
};

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
      ],
    }).compile();
    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('user repository should be defined', () => {
    expect(userRepository).toBeDefined();
  });

  it('generates a token', () => {
    expect(service.generateJwt(mockUserEntity)).toContain(JWTheader);
  });

  it('builds a user response', () => {
    expect(service.buildUserResponse(mockUserEntity)).toStrictEqual(
      mockResponse,
    );
  });

  describe('createUser', () => {
    it('checks the db for email', async () => {
      const test = await service.createUser(mockCreateUserDTO);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: mockCreateUserDTO.email,
      });
    });

    it('checks the db for username', async () => {
      const test = await service.createUser(mockCreateUserDTO);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        username: mockCreateUserDTO.username,
      });
    });
    it('should create a new user', async () => {
      const test = await service.createUser(mockCreateUserDTO);
      expect(test).toEqual(mockCreatedUser);
    });

    it('should reject duplicates', async () => {
      await expect(
        service.createUser(mockExistingUserDTO),
      ).rejects.toThrowError(
        'Either the username or the email is already taken',
      );
    });
  });

  describe('loginUser', () => {
    it('should log in valid user', async () => {
      jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValueOnce(mockExistingUser);
      jest.spyOn(bcryputils, 'compare').mockResolvedValueOnce(true);

      const test = await service.loginUser(mockLoginUserDTO);
      expect(test).toEqual(mockExistingUser);
    });

    it('should throw error for invalid user', async () => {
      await expect(service.loginUser(mockLoginUserDTO)).rejects.toThrowError(
        'No one by that email is available',
      );
    });

    it('should deny invalid password', async () => {
      jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValueOnce(mockExistingUser);
      jest.spyOn(bcryputils, 'compare').mockResolvedValueOnce(false);

      await expect(service.loginUser(mockLoginUserDTO)).rejects.toThrowError(
        error_messages.PASSWORD_FAILURE,
      );
    });
  });
});
