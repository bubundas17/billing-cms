import { ValidationError } from 'express-validator';

export default (errors: ValidationError[]) =>
  errors.reduce((acc, curr) => {
    acc[curr.param] = curr.msg;
    return acc;
  }, {});
