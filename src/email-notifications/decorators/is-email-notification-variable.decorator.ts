import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CreateEmailNotificationDTO } from '../dto/create-email-notification.dto';

@ValidatorConstraint({ name: 'isEmailNotificationVariable', async: false })
export class IsEmailNotificationVariable implements ValidatorConstraintInterface {
  validate(variables: CreateEmailNotificationDTO['variables']): boolean {
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
