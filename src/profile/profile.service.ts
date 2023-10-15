import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { ProfileType } from '../types/profile.type';
import { ProfileResponseInterface } from '../types/profileResponse.interface';
import { error_messages } from '../utils/constants';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getUserProfile(userId: number, profileUserName: string): Promise<any> {
    const profileUser = await this.userRepository.findOne({
      where: { username: profileUserName },
      relations: { followers: true },
    });
    if (!profileUser) {
      throw new HttpException(
        error_messages.PROFILE_NOT_FOUND(profileUserName),
        HttpStatus.NOT_FOUND,
      );
    }
    const isFollowing = profileUser.followers.some(
      (element) => element.id == userId,
    );
    return { ...profileUser, following: isFollowing };
  }

  async followUser(
    loggedInUser: UserEntity,
    profileUserName: string,
  ): Promise<any> {
    const profileUser = await this.userRepository.findOne({
      where: { username: profileUserName },
      relations: { followers: true },
    });
    if (!profileUser) {
      throw new HttpException(
        error_messages.PROFILE_NOT_FOUND(profileUserName),
        HttpStatus.NOT_FOUND,
      );
    }
    const isFollowing = profileUser.followers.some(
      (element) => (element.id = loggedInUser.id),
    );
    if (isFollowing) {
      throw new HttpException(
        error_messages.PROFILE_ALREADY_FOLLOWING(
          loggedInUser.username,
          profileUser.username,
        ),
        HttpStatus.PRECONDITION_FAILED,
      );
    } else {
      profileUser.followers.push(loggedInUser);
      await this.userRepository.save(profileUser);
      return { ...profileUser, following: true };
    }
  }

  async unFollowUser(
    loggedInUser: UserEntity,
    profileUserName: string,
  ): Promise<any> {
    const profileUser = await this.userRepository.findOne({
      where: { username: profileUserName },
      relations: { followers: true },
    });
    if (!profileUser) {
      throw new HttpException(
        error_messages.PROFILE_NOT_FOUND(profileUserName),
        HttpStatus.NOT_FOUND,
      );
    }
    const isFollowing = profileUser.followers.some(
      (element) => (element.id = loggedInUser.id),
    );
    if (isFollowing) {
      profileUser.followers.splice(
        profileUser.followers.findIndex((id) => id.id === loggedInUser.id),
        1,
      );
      await this.userRepository.save(profileUser);
      return { ...profileUser, following: false };
    } else {
      throw new HttpException(
        error_messages.PROFILE_NOT_FOLLOWING(
          loggedInUser.username,
          profileUser.username,
        ),
        HttpStatus.PRECONDITION_FAILED,
      );
    }
  }

  buildProfileResponse(profile: ProfileType): ProfileResponseInterface {
    return {
      profile: {
        username: profile.username,
        bio: profile.bio,
        image: profile.image,
        following: profile.following,
      },
    };
  }
}
