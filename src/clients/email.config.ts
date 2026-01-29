import { registerAs } from '@nestjs/config';

const emailConfig = registerAs('email', () => ({
  apiKey: process.env.EMAIL_API_KEY,
}));

export default emailConfig;
