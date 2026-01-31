import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CustomClassValidationError } from 'src/exceptions/custom-class-validation-error.exception';

export const validateClass = async function validateClass<
  ClassToValidateT extends new () => VariableT,
  VariableT extends object,
>(ClassToValidate: ClassToValidateT, variable: VariableT): Promise<VariableT> {
  const validatedVariable = plainToInstance(ClassToValidate, variable);

  const errors = await validate(validatedVariable);

  if (errors.length > 0) {
    throw new CustomClassValidationError(errors);
  }

  return validatedVariable;
};
