# Backend Challenge

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/heliomar-pena/notifications-backend-challenge/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/heliomar-pena/notifications-backend-challenge/tree/main)
[![Coverage Status](https://coveralls.io/repos/github/heliomar-pena/notifications-backend-challenge/badge.svg?branch=main)](https://coveralls.io/github/heliomar-pena/notifications-backend-challenge?branch=main)

Build a system of notifications handling for authenticated users.

The system must allow to each user manage and send notifications in different channels

## App Running on

- [Swagger](http://backend-challenge-a97513773692.herokuapp.com/api)

## Table of Content

- [Backend Challenge](#backend-challenge)
  - [App Running on](#app-running-on)
  - [Table of Content](#table-of-content)
  - [Features](#features)
    - [Authentication](#authentication)
    - [Notification handling](#notification-handling)
    - [Send notification](#send-notification)
  - [Notifications channel specifications](#notifications-channel-specifications)
    - [Email Channel](#email-channel)
      - [Templates](#templates)
      - [Variables](#variables)
      - [Custom validations](#custom-validations)
    - [SMS Channel](#sms-channel)
      - [SMS Custom validations](#sms-custom-validations)
    - [Push Channel](#push-channel)
      - [Push Custom validations](#push-custom-validations)
  - [Pre-requisites](#pre-requisites)
    - [To run it dockerized](#to-run-it-dockerized)
    - [To run it without docker](#to-run-it-without-docker)
  - [How to run the API](#how-to-run-the-api)
    - [Custom scripts](#custom-scripts)
      - [Run API](#run-api)
      - [Watch API (development mode)](#watch-api-development-mode)
      - [Run tests](#run-tests)
    - [With Docker](#with-docker)
      - [API](#api)
    - [Run DB with Docker and API with Node](#run-db-with-docker-and-api-with-node)
  - [Run the migrations](#run-the-migrations)
  - [How to run the tests](#how-to-run-the-tests)
    - [Tests with Docker](#tests-with-docker)
    - [Test DB in docker, but the tests in node](#test-db-in-docker-but-the-tests-in-node)
  - [Areas to improve](#areas-to-improve)
  - [Technologies](#technologies)
  - [Decisions made](#decisions-made)
  - [Routes](#routes)
  - [Env Vars](#env-vars)


## Features

### Authentication

1. Email and password authentication method implemented with passport.
2. Sessionless authentication with JWT token.
3. Endpoints have a authentication middleware that checks the user's token.

### Notification handling

1. Create notifications in any of the three channels (SMS, PUSH, EMAIL).
2. Edit notifications for any of the three channels, the notification must be in status Created.
3. Get notification with details (Notifications details could vary depending of the channel choosen. For example, the template information for the e-mail notifications will be displayed in the details).
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

There are some endpoints dedicated to templates where it's possible to:

- Create template and declare variables for that template.
- Edit template.
- Get template.
- Delete template.
- Publish template.

In order to create an email notification, we will need to follow the next flow:

1. Create a template.
2. Publish the template.
3. Create the notification, including the template we want to use and the variables that will be interpolated.
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

In order to create a SMS notification, we should:

1. Create the notification with channel 'sms'.
2. Send the notification.

#### SMS Custom validations

- When creating the notification:
  - Every destination must be a phone number.
  - Content can not exceed 160 characters.

### Push Channel

In order to create a Push notifications, we should:

1. Create the notification with channel 'push'.
2. Send the notification.

#### Push Custom validations

- When creating the notification:
  - Every destination must be a valid FCM token.

## Pre-requisites

### To run it dockerized

1. Docker installed without SUDO permission.
2. Docker compose installed without SUDO permission.
3. Ports free: 3000 and 5433.
4. Configure env vars. Check .env.example for a reference

### To run it without docker

1. Postgres 17
2. Node 24

## How to run the API

### Custom scripts

There are some custom scripts that can be used instead of writing the docker command manually.

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

When docker run in mode watch, logs are hidden, it's possible to access them running the next script in a new terminal:

```sh
./scripts/logs_dev.sh
```

#### Run tests

```sh
./scripts/up_test.sh
```

### With Docker

As alternative, can be run using Docker compose directly, instead of the custom scripts.

#### API

```bash
docker compose --profile api up
```

Or with watch mode (hotreload):

```bash
docker compose --profile api watch
```

> [!NOTE]
> In watch mode, logs are hidden, they can be accessed by running:
>
> ```bash
> docker compose --profile api logs -f
> ```

### Run DB with Docker and API with Node

It's also possible to start only the Database in Docker, and the application in NodeJS.

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

4. Then run the app:

   ```bash
   npm run start:dev
   ```

Remember to fill the DB credentials in the .envs.

## Run the migrations

Running the DB (in postgres or locally) its the first step, the second step is filling the DB with the needed structure, for that, we use migrations which contains the tables and columns we need on the application.

Also, if wanted, there are also seeds that loads small pre-defined data to start working on. To run the seeds, it's needed to add the `DATABASE_RUN_SEEDS=true` variable in the .env file.

To run the migrations, fill the .env with the data to connect to the database, then run:

```bash
npm run typeorm:migrate
```

## How to run the tests

The tests uses a test database which is preferable to run in docker, that is why there is a profile in the docker compose dedicated to the tests, that way the tests can be ran with only one command.

There is also the possibility of running the postgres_test database from the docker compose, and run the tests using node directly.

### Tests with Docker

```bash
docker compose --profile test up
```

> [!NOTE]
> To run it in watch mode, logs are hidden by default, they can be accessed by running:
>
> ```bash
> docker compose --profile api logs -f
> ```

### Test DB in docker, but the tests in node

```bash
docker compose up postgres_test
```

Then run the tests:

```bash
npm run test:e2e
```

> [!NOTE]
> Remember to fill the DB credentials in the .envs.

## Areas to improve

- Swagger documentation can be moved to an external file.
- Error handling could be improved (e.g if user tries to modify a notification channel, not error is thrown but it's not allowed).
- SMS and PUSH notifications could be have a more serious implementation. Like adding a way to verify the phone number that will be used for SMS notifications, or making a more realistic integration of PUSH notifications. Also, we would need a way to register and the emails that will be used in the e-mail channel from the application, currently that is possible only on the provider's side.

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

- Local: [API Swagger](http://localhost:3000/api)

## Env Vars

1. DB environment variables: Fill it with the details of the postgres db, if postgres is running on Docker, then copy and paste the values from docker-compose.
2. JWT_SECRET: This is the value used for encrypt and decrypt the JWT tokens. Any value can be used here, however it's good practice to use a strong password difficult to break, like a hash. There are some online tools that generates secure hash for this purpose, like [jwt secret key generator](https://jwtsecretkeygenerator.com/).
3. Email Services: It's actually integrated with [resend](https://resend.com/), so it's possible to use it with the actual resend API to send emails. In that case, it's needed to fill `EMAIL_API_URL` with the value `https://api.resend.com`, `EMAIL_API_KEY` with the resend's API KEY and `FROM_EMAIL` with the email registered in resend (it's `onboarding@resend.dev` in the case there is not any registered email). If we want to run the APP without using the real resend integration, just fill the details with random values. (Email templates and notifications via channel email will not work properly).
4. Notifications Providers: Just fill it with random values as they are not real APIs.
