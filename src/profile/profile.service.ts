import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { DataSource, Repository } from 'typeorm';
import { ProfileType } from '../types/profile.type';
import { ProfileResponseInterface } from '../types/profileResponse.interface';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private dataSource: DataSource,
  ) {}

  async getUserProfile(userId: number, profileUserName: string): Promise<any> {
    const profileUser = await this.userRepository.findOne({
      where: { username: profileUserName },
      relations: { followers: true },
    });
    if (!profileUser) {
      throw new HttpException(
        `Profile ${profileUserName} does not exist`,
        HttpStatus.NOT_FOUND,
      );
    }
    const isFollowing = profileUser.followers.some(
      (element) => (element.id = userId),
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
        `Profile ${profileUserName} does not exist`,
        HttpStatus.NOT_FOUND,
      );
    }
    const isFollowing = profileUser.followers.some(
      (element) => (element.id = loggedInUser.id),
    );
    if (isFollowing) {
      throw new HttpException(
        `user ${loggedInUser.username} is already following ${profileUser.username}`,
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
        `Profile ${profileUserName} does not exist`,
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
        `user ${loggedInUser.username} isn't following ${profileUser.username}`,
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
