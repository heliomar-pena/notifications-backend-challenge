export const baseNotificationResponseExample = {
  id: '1234',
  title: 'My great notification',
  content: 'Hello world!',
  channel: 'sms',
  reference_id: 'string',
  status: 'created',
  destinations: [''],
};

export const baseNotificationEditRequestExample = {
  title: 'A serious notification',
  content: 'This is very serious',
  destinations: [''],
};

export const baseNotificationCreateRequestExample = {
  channel: 'sms',
  title: 'My great notification',
  content: 'Hello world!',
  destinations: [''],
};

export const generateNotificationPayloadExamples = <T extends object>(
  override: T,
) => ({
  notificationResponseExample: {
    ...baseNotificationResponseExample,
    ...override,
  },
  notificationEditRequestExample: {
    ...baseNotificationEditRequestExample,
    ...override,
  },
  notificationCreateRequestExample: {
    ...baseNotificationCreateRequestExample,
    ...override,
  },
});
