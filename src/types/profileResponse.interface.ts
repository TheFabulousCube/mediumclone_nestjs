import { ProfileType } from "./profile.type";

export interface ProfileResponseInterface {
    profile: {
        username: string,
        bio: string,
        image: string,
        following: boolean
    }
  }