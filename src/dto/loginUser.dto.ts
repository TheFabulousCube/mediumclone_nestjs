import { HttpStatus } from '@nestjs/common';
import { IsEmail, IsNotEmpty } from 'class-validator';
import * as Joi from 'joi';

export const loginUserSchema: Joi.Schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.string().email().error(Error('Missing email error')  )
});

export class LoginUserDto {

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    readonly password: string;
}
