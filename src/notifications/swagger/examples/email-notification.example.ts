import { generateNotificationPayloadExamples } from './base-notification.example';

const {
  notificationCreateRequestExample: emailNotificationCreateRequestExample,
  notificationEditRequestExample: emailNotificationEditRequestExample,
  notificationResponseExample: emailNotificationResponseExample,
} = generateNotificationPayloadExamples({
  channel: 'email',
  destinations: ['john.doe@local.com'],
  template_id: '781c2c8d-cde8-4bd2-8967-b76f1947cbee',
  variables: {
    MY_VARIABLE: 'Value for that variable!',
  },
});

export {
  emailNotificationCreateRequestExample,
  emailNotificationEditRequestExample,
  emailNotificationResponseExample,
};
