import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserResponseInterface } from '../../../types/userResponse.interface';
import { UserEntity } from '../../../user/user.entity';
import { UserService } from '../../user.service';
import { AuthMiddleware } from './auth.middleware';

const mockUser: UserEntity = {
  id: 3,
  username: 'username',
  email: 'email',
  bio: 'bio',
  image: 'imageURL',
  password: 'password',
  hashPassword: function (): Promise<void> {
    throw new Error('Function not implemented.');
  },
  favorites: [],
  followers: [],
  following: [],
  articles: [],
  toUserResponseInterface: function (token: string): UserResponseInterface {
    throw new Error('Function not implemented.');
  },
};

describe('AuthMiddleware', () => {
  let middleware: AuthMiddleware;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AuthMiddleware,
        UserService,
        UserEntity,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            save: jest.fn().mockResolvedValue(mockUser),
            find: jest.fn().mockResolvedValue([mockUser]),
          },
        },
      ],
    }).compile();

    middleware = moduleRef.get<AuthMiddleware>(AuthMiddleware);
  });
  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });
});
