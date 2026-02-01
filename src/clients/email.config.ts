import { registerAs } from '@nestjs/config';

const emailConfig = registerAs('email', () => {
  const fromEmail = process.env.FROM_EMAIL;

  if (!fromEmail)
    throw new Error(`Environment variable FROM_EMAIL is required`);

  return {
    apiKey: process.env.EMAIL_API_KEY,
    url: process.env.EMAIL_API_URL,
    fromEmail,
  };
});

export default emailConfig;
