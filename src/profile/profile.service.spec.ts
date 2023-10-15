import { Test, TestingModule } from '@nestjs/testing';
import { expect, jest, test } from '@jest/globals';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProfileService } from './profile.service';
import { UserEntity } from '../user/user.entity';
import { mockExistingUser, mockUserEntity } from '../user/mockUsers';
import { error_messages } from '../utils/constants';
import { ProfileType } from '../types/profile.type';
import { ProfileResponseInterface } from '../types/profileResponse.interface';

const mockUserRepository = {
  findOneBy: jest.fn((user: UserEntity) => {
    if (
      user.email == mockExistingUser.email ||
      user.username == mockExistingUser.username ||
      user.id == mockExistingUser.id
    ) {
      return Promise.resolve(mockExistingUser);
    }
    return Promise.resolve(null);
  }),

  findOne: jest.fn((user: UserEntity) => {
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

describe('Profile Service', () => {
  let service: ProfileService;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
      ],
    }).compile();
    service = module.get<ProfileService>(ProfileService);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockExistingUser);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('user repository should be defined', () => {
    expect(userRepository).toBeDefined();
  });

  describe('get user profile', () => {
    it("throws error if the profile user isn't found", async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      await expect(
        service.getUserProfile(mockUserEntity.id, 'nonexistantProfileUser'),
      ).rejects.toThrowError(
        error_messages.PROFILE_NOT_FOUND('nonexistantProfileUser'),
      );
    });

    it('returns not following for user not following profile user', async () => {
      await expect(
        service.getUserProfile(86, mockExistingUser.username),
      ).resolves.toEqual({ ...mockExistingUser, following: false });
    });

    it('returns following for user following profile user', async () => {
      await expect(
        service.getUserProfile(mockUserEntity.id, mockExistingUser.username),
      ).resolves.toEqual({ ...mockExistingUser, following: true });
    });
  });

  describe('follow user', () => {
    it('throws error for profile not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      await expect(
        service.followUser(mockUserEntity, mockExistingUser.username),
      ).rejects.toThrowError(
        error_messages.PROFILE_NOT_FOUND(mockExistingUser.username),
      );
    });

    it('throws error for already following', async () => {
      await expect(
        service.followUser(mockUserEntity, mockExistingUser.username),
      ).rejects.toThrowError(
        error_messages.PROFILE_ALREADY_FOLLOWING(
          mockUserEntity.username,
          mockExistingUser.username,
        ),
      );
    });

    it('follows user', async () => {
      mockExistingUser.followers = [];
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockExistingUser);
      await expect(
        service.followUser(mockUserEntity, mockExistingUser.username),
      ).resolves.toEqual({ ...mockExistingUser, following: true });
    });
  });

  describe('UN follow user', () => {
    it('throws error if not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      await expect(
        service.unFollowUser(mockExistingUser, mockUserEntity.username),
      ).rejects.toThrowError(
        error_messages.PROFILE_NOT_FOUND(mockUserEntity.username),
      );
    });

    it('UN follows user', async () => {
      await expect(
        service.unFollowUser(mockUserEntity, mockExistingUser.username),
      ).resolves.toEqual({ ...mockExistingUser, following: false });
    });

    it('throws error if not following', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockExistingUser);
      await expect(
        service.unFollowUser(mockExistingUser, mockUserEntity.username),
      ).rejects.toThrowError(
        error_messages.PROFILE_NOT_FOLLOWING(
          mockExistingUser.username,
          mockExistingUser.username,
        ),
      );
    });
  });

  describe('build profile response', () => {
    it('takes a profile type and returns a profile response interface', () => {
      const profile = { ...mockUserEntity, following: true } as ProfileType;
      let profileResponse: ProfileResponseInterface = {
        profile: {
          username: 'mockUser',
          bio: 'self',
          image: 'imageURL',
          following: true,
        },
      };
      expect(service.buildProfileResponse(profile)).toEqual(profileResponse);
    });
  });
});
