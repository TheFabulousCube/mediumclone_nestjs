import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ExpressRequest } from 'src/types/expressRequest.interface';
import { mockResponse, mockUserEntity } from './mockUsers';

describe('UserController', () => {
  let userController: UserController;
  let appService: UserService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            getUser: jest.fn(),
            createUser: jest.fn(),
            loginUser: jest.fn(),
            updateUser: jest.fn(),
            buildUserResponse: jest.fn(() => {
              return Promise.resolve(mockResponse);
            }),
          },
        },
      ],
    }).compile();

    userController = app.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  it('should return the current user', async () => {
    const value = await userController.currentUser(
      mockUserEntity as unknown as ExpressRequest,
    );
    expect(value).toEqual(mockResponse);
  });

  it('should return create user', async () => {
    const value = await userController.createUser(mockUserEntity);
    expect(value).toEqual(mockResponse);
  });

  it('should return logged in user', async () => {
    const value = await userController.loginUser(mockUserEntity);
    expect(value).toEqual(mockResponse);
  });

  it('should return updated user', async () => {
    const value = await userController.updateCurrentUser(
      mockUserEntity as any as ExpressRequest,
      mockUserEntity,
    );
    expect(value).toEqual(mockResponse);
  });
});
