import { generateNotificationPayloadExamples } from './base-notification.example';

const {
  notificationCreateRequestExample: pushNotificationCreateRequestExample,
  notificationEditRequestExample: pushNotificationEditRequestExample,
  notificationResponseExample: pushNotificationResponseExample,
} = generateNotificationPayloadExamples({
  channel: 'push',
  destinations: ['a'.repeat(120)],
});

export {
  pushNotificationCreateRequestExample,
  pushNotificationEditRequestExample,
  pushNotificationResponseExample,
};
