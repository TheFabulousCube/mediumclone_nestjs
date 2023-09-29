import { HttpException, HttpStatus } from '@nestjs/common';
import { number } from 'joi';
import { createUserSchema } from './dto/createUser.dto';
import { JoiValidationPipe } from './validation.pipe';

const schema = createUserSchema;

const testObject = {
  username: 'user1',
  email: 'someonesomewhere.com',
  password: 'HackMe',
};
describe('Validation Pipe', () => {
  let pipe: JoiValidationPipe;

  beforeEach(() => {
    pipe = new JoiValidationPipe(schema);
  });

  it('should be defined', () => {
    expect(new JoiValidationPipe(schema)).toBeDefined();
  });
  it(`should throw error for email`, () => {
    // const value = () => pipe.transform(testObject);
    // expect(value).toThrowError(HttpException);
    expect(() => {
      pipe.transform(testObject);
    }).toThrow(
      new HttpException(
        {
          statusCode: HttpStatus.I_AM_A_TEAPOT,
          message: 'Http Exception',
          code: expect.any(number),
          funstuff: expect.anything(),
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      ),
    );
  });
});
