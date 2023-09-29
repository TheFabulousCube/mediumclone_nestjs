import { IsEmail, IsNotEmpty } from "class-validator";
import * as Joi from 'joi';

export const updateUserSchema: Joi.Schema = Joi.object({
    email: Joi.string().email().optional(),
    bio: Joi.string().optional(),
    image: Joi.string().optional(),
    username: Joi.string().optional(),
    password: Joi.string().optional(),
}).or('email', 'bio', 'image', 'username', 'password');

export class UpdateUserDto {

    readonly email?: string;

    readonly bio?: string;

    readonly image?: string;

    readonly username?: string;

    readonly password?: string;
};