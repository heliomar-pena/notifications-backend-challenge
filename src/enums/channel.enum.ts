export const Channel = {
  EMAIL: 'email',
  SMS: 'sms',
  PUSH: 'push',
} as const;

export const ChannelValues = Object.values(Channel);

export type ChannelKeysType = keyof typeof Channel;
export type ChannelValuesType = (typeof Channel)[ChannelKeysType];
