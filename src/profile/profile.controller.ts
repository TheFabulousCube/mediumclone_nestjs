import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ExpressRequest } from '../types/expressRequest.interface';
import { AuthGuard } from '../user/guards/auth.guard';
import { ProfileResponseInterface } from '../types/profileResponse.interface';
import { ProfileService } from './profile.service';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':username')
  async getProfile(
    @Req() request: ExpressRequest,
    @Param('username') profileUserName: string,
  ): Promise<ProfileResponseInterface> {
    const profile = await this.profileService.getUserProfile(
      request.user?.id,
      profileUserName,
    );
    return this.profileService.buildProfileResponse(profile);
  }

  @Post(':username/follow')
  @UseGuards(AuthGuard)
  async followUser(
    @Req() request: ExpressRequest,
    @Param('username') profileUserName: string,
  ): Promise<any> {
    const profile = await this.profileService.followUser(
      request.user,
      profileUserName,
    );
    return this.profileService.buildProfileResponse(profile);
  }

  @Delete(':username/follow')
  @UseGuards(AuthGuard)
  async unFollowUser(
    @Req() request: ExpressRequest,
    @Param('username') profileUserName: string,
  ): Promise<any> {
    const profile = await this.profileService.unFollowUser(
      request.user,
      profileUserName,
    );
    return this.profileService.buildProfileResponse(profile);
  }
}
