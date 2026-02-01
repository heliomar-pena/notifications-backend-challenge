import { generateNotificationPayloadExamples } from './base-notification.example';

const {
  notificationCreateRequestExample: smsNotificationCreateRequestExample,
  notificationEditRequestExample: smsNotificationEditRequestExample,
  notificationResponseExample: smsNotificationResponseExample,
} = generateNotificationPayloadExamples({
  destinations: ['+5491112345678'],
});

export {
  smsNotificationCreateRequestExample,
  smsNotificationEditRequestExample,
  smsNotificationResponseExample,
};
