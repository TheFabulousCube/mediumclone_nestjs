import * as Joi from "joi";

export const updateArticleSchema: Joi.Schema = Joi.object({
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    body: Joi.string().optional()
}).or('title', 'description', 'body');


export class UpdateArticleDto {
    readonly title: string;
    readonly description: string;
    readonly body: string;

}