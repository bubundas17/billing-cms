import { ValidationError } from 'class-validator';

function mappedErrors(errors: ValidationError[]): { [key: string]: string } {
  return errors.reduce((obj, curr) => {
    const constraints = curr.constraints;
    if (constraints) {
      const message = Object.keys(constraints).shift();
      if (message) obj[curr.property] = constraints[message];
    }
    return obj;
  }, {} as { [key: string]: string });
}

export default mappedErrors;
