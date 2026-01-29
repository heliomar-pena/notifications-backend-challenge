export const NotificationStatus = {
  CREATED: 'created',
  SENT: 'sent',
  DELIVERED: 'delivered',
};

export const NotificationStatusValues = Object.values(NotificationStatus);

export type NotificationStatusType =
  (typeof NotificationStatus)[keyof typeof NotificationStatus];
