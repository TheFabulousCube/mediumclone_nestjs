import { IsEmail, IsNotEmpty } from 'class-validator';
import * as Joi from 'joi';

export const createUserSchema: Joi.Schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.string().email().messages({ 'string.email': 'I want candy' }),
    bio: Joi.string().optional(),
    image: Joi.string().optional(),
});

export class CreateUserDto {
    @IsNotEmpty()
    readonly username: string;

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    readonly password: string;
}
