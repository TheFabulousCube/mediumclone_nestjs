import { UserEntity } from "../user/user.entity";

export type ProfileType = UserEntity & { following: boolean };

