import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CreateEmailNotificationDto } from '../dto/create-email-notification';

@ValidatorConstraint({ name: 'isEmailNotificationVariable', async: false })
export class IsEmailNotificationVariable implements ValidatorConstraintInterface {
  validate(variables: CreateEmailNotificationDto['variables']): boolean {
    return (
      !variables ||
      Object.values(variables).every(
        (value) => typeof value === 'string' || typeof value === 'number',
      )
    );
  }

  defaultMessage(): string {
    return 'Variables can only contain strings or numbers';
  }
}
