import { Test, TestingModule } from '@nestjs/testing';
import { expect, jest, test } from '@jest/globals';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { ExpressRequest } from 'src/types/expressRequest.interface';
import {
  JWTheader,
  mockExistingUser,
  mockExistingUserDTO,
  mockResponse,
  mockUserEntity,
} from '../user/mockUsers';
import { UserResponseInterface } from 'src/types/userResponse.interface';
import { UserEntity } from 'src/user/user.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ProfileType } from 'src/types/profile.type';

describe('ProfileController', () => {
  let controller: ProfileController;
  let service: ProfileService;
  const mockRequest = () => {
    return {
      user: null,
    };
  };
  const mockProfile = {
    username: 'existingUsername',
    bio: 'self',
    image: 'imageURL',
    following: true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        {
          provide: ProfileService,
          useValue: {
            getUserProfile: jest.fn(),
            followUser: jest.fn(),
            unFollowUser: jest.fn(),
            buildProfileResponse: jest.fn((profile: ProfileType) => {
              return {
                profile: {
                  username: profile.username,
                  bio: profile.bio,
                  image: profile.image,
                  following: profile.following,
                },
              };
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
    service = module.get<ProfileService>(ProfileService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('get profile', () => {
    it('should throw when profile not found', async () => {
      jest
        .spyOn(service, 'getUserProfile')
        .mockRejectedValue(new Error('Async error message'));

      await expect(
        controller.getProfile(
          mockUserEntity as unknown as ExpressRequest,
          'user1',
        ),
      ).rejects.toThrow('Async error message');
    });

    it('should return profile when user not logged in', async () => {
      mockProfile.following = false;
      jest
        .spyOn(service, 'getUserProfile')
        .mockResolvedValue({ ...mockExistingUser, following: false });
      const value = await controller.getProfile(
        mockRequest as unknown as ExpressRequest,
        mockExistingUser.username,
      );

      expect(value.profile).toEqual(mockProfile);
    });

    it('should return profile when user is logged in', async () => {
      mockProfile.following = true;
      jest
        .spyOn(service, 'getUserProfile')
        .mockResolvedValue({ ...mockExistingUser, following: true });
      const value = await controller.getProfile(
        mockUserEntity as unknown as ExpressRequest,
        mockExistingUser.username,
      );

      expect(value.profile).toEqual(mockProfile);
    });
  });

  describe('follow user', () => {
    it('throws when no profle is found', async () => {
      jest
        .spyOn(service, 'followUser')
        .mockRejectedValue(new Error('Async error message'));

      await expect(
        controller.followUser(
          mockUserEntity as unknown as ExpressRequest,
          'user1',
        ),
      ).rejects.toThrow('Async error message');
    });

    it('should follow user once', async () => {
      jest
        .spyOn(service, 'followUser')
        .mockResolvedValueOnce({ ...mockExistingUser, following: true })
        .mockRejectedValueOnce(Error('Async error message'));
      const value = await controller.followUser(
        mockUserEntity as unknown as ExpressRequest,
        mockExistingUser.username,
      );
      expect(value.profile).toEqual(mockProfile);

      await expect(
        controller.followUser(
          mockUserEntity as unknown as ExpressRequest,
          'user1',
        ),
      ).rejects.toThrow('Async error message');
    });
  });

  describe('UN follow user', () => {
    it('should throw when profile not found', async () => {
      jest
        .spyOn(service, 'unFollowUser')
        .mockRejectedValueOnce(new Error('Async error message'));

      await expect(
        controller.unFollowUser(
          mockUserEntity as unknown as ExpressRequest,
          'user1',
        ),
      ).rejects.toThrow('Async error message');
    });

    it('should prompt to log in if not logged in', async () => {
      // should be covered by Auth Guard
    });

    it('should unfollow user once', async () => {
      mockProfile.following = false;
      jest
        .spyOn(service, 'unFollowUser')
        .mockResolvedValueOnce({ ...mockExistingUser, following: false })
        .mockRejectedValueOnce(Error('Async error message'));
      const value = await controller.unFollowUser(
        mockUserEntity as unknown as ExpressRequest,
        mockExistingUser.username,
      );
      expect(value.profile).toEqual(mockProfile);

      await expect(
        controller.unFollowUser(
          mockUserEntity as unknown as ExpressRequest,
          'user1',
        ),
      ).rejects.toThrow('Async error message');
    });
  });
});
