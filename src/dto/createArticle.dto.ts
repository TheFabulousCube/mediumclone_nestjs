import { IsNotEmpty } from "class-validator";
import * as Joi from "joi";

export const createArticleSchema: Joi.Schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    body: Joi.string().required(),
    tagList: Joi.array<string>().optional()
});

export class CreateArticleDto {
    @IsNotEmpty()
    readonly title: string;

    @IsNotEmpty()
    readonly description: string;

    @IsNotEmpty()
    readonly body: string;

    readonly tagList?: string[];
}