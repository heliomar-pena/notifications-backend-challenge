# Backend Challenge

You have to build a system of notifications handling for authenticated users.

The system must allow to each user manage and send notifications in different channels

## Features

### Authentication

1. Email and password authentication method implemented with passport.
2. Sessionless authentication with JWT token.
3. Endpoints have a authentication middleware that checks the user's token.

### Notification handling

1. Create notifications in any of the three channels (SMS, PUSH, EMAIL).
2. Edit notifications for any of the three channels, the notification must be in status Created.
3. Get notification with details (Notifications details could vary depending of the channel choosen. For example, for Email notification you will see the template information in the details).
4. Get all notifications user's notifications.
5. Delete a notification.

### Send notification

Once created the notification, user can send the notification using the desired channel.

1. Send notification in a different endpoint.
2. The external ID is saved as reference, in case in the future we have webhook to receive notifications about the status of the notification.

## Notifications channel specifications

Added flows to handle notification in 3 different channels: SMS, PUSH, EMAIL.

In every channels is allowed to create, edit, delete and create a notification. But each channel have different requirements, and can have different behaviours.

### Email Channel

Emails notifications needs a Template to be sent. The template can contain variables that can be modified in the moment of creating a notification, that way multiple notifications can use the same template and have different content.

There are some endpoints dedicated to templates where you can:

- Create template and declare variables for that template.
- Edit template.
- Get template.
- Delete template.
- Publish template.

In order to create an email notification, you should:

1. Create a template.
2. Publish the template.
3. Create the notification, including the template you want to use and the variables that will be interpolated.
4. Send the notification.

#### Templates

Templates are created and saved on our email notifications provider, we only save the reference to that resource (the template_id), this allow us to identify which templates belongs to the logged user and limit users to use its own templates only, so as relation the templates with the email notifications.

#### Variables

Variables and extra details for email notifications are saved in a different table (email_notifications), since the details for different channels can vary, so the main table only contains the columns that are shared along all the channel's strategies.

#### Custom validations

- When creating the notification:
  - Destinations must be emails
  - Template is required and must be a valid UUID.
  - Template provided must exists in our Database.
- When sending the notification:
  - Template must be valid on our email notification's provider.
  - Required variables must be provided.
  - Template HTML must be valid.

### SMS Channel

In order to create a SMS notification, you should:

1. Create the notification with channel 'sms'.
2. Send the notification.

#### SMS Custom validations

- When creating the notification:
  - Every destination must be a phone number.
  - Content can not exceed 160 characters.

### Push Channel

In order to create a Push notifications, you should:

1. Create the notification with channel 'push'.
2. Send the notification.

#### Push Custom validations

- When creating the notification:
  - Every destination must be a valid FCM token.

## Pre-requisites

### If you want to run it dockerized

1. Docker installed without SUDO permission.
2. Docker compose installed without SUDO permission.
3. Ports free: 3000 and 5433.

### If you want to run it without docker

1. Postgres 17
2. Node 24

## How to run it

### API with Docker

```bash
docker compose --profile api up
```

Or with watch mode (hotreload):

```bash
docker compose --profile api watch
```

> [!NOTE]
> In watch mode, logs are hidden, you can access them by running:
>
> ```bash
> docker compose --profile api watch
> ```
