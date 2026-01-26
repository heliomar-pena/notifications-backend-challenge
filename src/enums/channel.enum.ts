export const Channel = {
  EMAIL: 'email',
  SMS: 'sms',
  PUSH: 'push',
};

export const ChannelValues = Object.values(Channel);

export type ChannelType = (typeof Channel)[keyof typeof Channel];
