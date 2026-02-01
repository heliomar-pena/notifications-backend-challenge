export const NotificationStatus = {
  CREATED: 'created',
  SENT: 'sent',
} as const;

export const NotificationStatusValues = Object.values(NotificationStatus);

export type NotificationsKeyType = keyof typeof NotificationStatus;
export type NotificationStatusType =
  (typeof NotificationStatus)[NotificationsKeyType];
