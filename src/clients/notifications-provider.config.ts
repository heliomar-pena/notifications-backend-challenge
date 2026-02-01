import { registerAs } from '@nestjs/config';

const notificationsProviderConfig = registerAs('notificationsProvider', () => {
  const url = process.env.NOTIFICATIONS_PROVIDER_URL;
  const apiKey = process.env.NOTIFICATIONS_PROVIDER_API_KEY;

  if (!url) throw new Error('NOTIFICATIONS_PROVIDER_URL is mandatory');
  if (!apiKey) throw new Error('NOTIFICATIONS_PROVIDER_API_KEY is mandatory');

  return {
    apiKey: process.env.NOTIFICATIONS_PROVIDER_API_KEY,
    url,
  };
});

export default notificationsProviderConfig;
