import { generateNotificationPayloadExamples } from './base-notification.example';

const {
  notificationCreateRequestExample: emailNotificationCreateRequestExample,
  notificationEditRequestExample: emailNotificationEditRequestExample,
  notificationResponseExample: emailNotificationResponseExample,
} = generateNotificationPayloadExamples({
  destinations: ['john.doe@local.com'],
  template_id: '123',
  variables: {
    MY_VARIABLE: 'Value for that variable!',
  },
});

export {
  emailNotificationCreateRequestExample,
  emailNotificationEditRequestExample,
  emailNotificationResponseExample,
};
