import { ValidationError } from 'class-validator';

function mappedErrors(errors: ValidationError[]): Record<string, string> {
  return errors.reduce((obj, curr) => {
    obj[curr.property] =
      curr.constraints[Object.keys(curr.constraints).shift()];
    return obj;
  }, {});
}

export default mappedErrors;
