# Backend Challenge

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/heliomar-pena/notifications-backend-challenge/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/heliomar-pena/notifications-backend-challenge/tree/main)

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
4. Configure env vars. Check .env.example for a reference

### If you want to run it without docker

1. Postgres 17
2. Node 24

## How to run the API

### Custom scripts

There are some custom scripts you can use instead of writing the docker command manually.

#### Run API

Starts the DB and the API:

```sh
./scripts/up_dev.sh
```

#### Watch API (development mode)

Starts the DB and the API in Watch mode:

```sh
./scripts/watch_dev.sh
```

When docker run in mode watch, logs are hidden, you have to access them in other terminal with the next script:

```sh
./scripts/logs_dev.sh
```

#### Run tests

```sh
./scripts/up_test.sh
```

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
> docker compose --profile api logs -f
> ```

### Run only the DB with docker and the API with node.

1. Start the DB

    ```bash
    docker compose up postgres_db
    ```

2. Switch to Node 24, for nvm just run:

    ```bash
    nvm use
    ```

3. Install the dependencies:

    ```bash
    npm i
    ```

4. Then you can run the app:

    ```bash
    npm run start:dev
    ```

Remember to fill the DB credentials in the .envs.

## How to run the tests

### Tests with Docker

```bash
docker compose --profile test up
```

> [!NOTE]
> In watch mode, logs are hidden, you can access them by running:
>
> ```bash
> docker compose --profile api logs -f
> ```

### Run only the testing DB with docker and the tests with node.

```bash
docker compose up postgres_test
```

Then you can run the tests:

```bash
npm run test:e2e
```

> [!NOTE]
> Remember to fill the DB credentials in the .envs.

## Areas to improve

- Swagger documentation can be moved to an external file.
- Error handling could be improved (e.g if user tries to modify a notification channel, not error is thrown but it's not allowed).
- We need a way to register and validate the phone number and the emails that will be used in e-mail and sms channels.

## Technologies

- Nest
- Node
- TypeORM
- PostgresSQL

## Decisions made

- Clean Architecture: To be able to handle further changes in the future in a proper way.
- TypeORM: It is already integrated with NestJS Framework and it's the most popular ORM, so it's easy to find solutions and people that know how to use it.
- Docker: To make it portable.
- Jest/Testing/E2E: Jest is the most used testing framework. E2E testing was done because in this case testing all features together is more convenient that testing every single part of the application, allowing us to test how the strategies integrates with services properly depending of the payload passed to the controller.
- Strategy pattern: Was used for different channels to make it easy to continue adding more channels without modifying the current code. This pattern allows different behaviors for each channel.
- Template pattern: To avoid repeating logic between the different channels, used the template pattern to build the skeleton of the class for notifications, and then overrided the necessary methods (for example, the methods of validation of the payload), in each strategy.

## Routes

- [API Swagger](http://localhost:3000/api)

## Env Vars

1. DB environment variables: Fill it with the details of your postgres db, if you're using docker for the postgres db, then copy and paste the values from docker-compose.
2. JWT_SECRET: This is the value used for encrypt and decrypt your user's JWT tokens. You can use any value here, or use a online tool for generate a secure hash, like [this one](https://jwtsecretkeygenerator.com/).
3. Email Services: It's actually integrated with [resend](https://resend.com/), so if you have an account or want to create one, you can fill EMAIL_API_URL with `https://api.resend.com`, `EMAIL_API_KEY` with your API KEY and `FROM_EMAIL` with your registered email (it's `onboarding@resend.dev` in the case you have not any registered email). If you don't want to use resend, just fill the details with random values. (Email templates and email notifications will not work properly).
4. Notifications Providers: Just fill it with random values as they are not real APIs.
