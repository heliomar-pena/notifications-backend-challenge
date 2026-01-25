import { registerAs } from '@nestjs/config';

export const authConfig = registerAs('auth', () => {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET?.length <= 2)
    throw new Error(
      'JWT_SECRET must be provided with a value longer than 2 characters',
    );

  return {
    jwtSecret: process.env.JWT_SECRET,
    salt: process.env.HASH_SALT ?? 10,
  };
});
