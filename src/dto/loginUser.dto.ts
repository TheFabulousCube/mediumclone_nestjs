import { IsEmail, IsNotEmpty } from 'class-validator';
import * as Joi from 'joi';

export const loginUserSchema: Joi.Schema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().email().required(),
});

export class LoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;
}
