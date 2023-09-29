import {
  PipeTransform,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import Joi from 'joi';

// HINT
// PipeTransform<T, R> is a generic interface that must be implemented by any pipe.
// The generic interface uses T to indicate the type of the input value,
//  and R to indicate the return type of the transform() method.
@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: Joi.Schema) {}

  transform(value: any) {
    const { error } = this.schema.validate(value, { abortEarly: false });
    if (error) {
      throw new HttpException(
        { error: this.formatErrors(error.details) },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return value;
  }
  formatErrors(errors: Joi.ValidationErrorItem[]) {
    return errors.reduce(buildResponse, {});
  }
}
function buildResponse(
  acc,
  error: Joi.ValidationErrorItem,
): Joi.ValidationErrorItem {
  acc[error.path[0]] = error.message.replace(/["]/g, '');
  return acc;
}
