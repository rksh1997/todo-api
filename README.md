# Todo API

A todo list api just for sharping my Node.js skills.

## Prerequisites
1. [Node.js](https://nodejs.org)
2. [Yarn](https://yarnpkg.com/)

## Environment Variables
| Variable              | Description                                                              | Example                               |
| --------------------- | ------------------------------------------------------------------------ | ------------------------------------- |
| PORT                  | On which port to run the app ?                                           | 7000                                  |
| JWT_SECRET            | Strong secret string used to encrypt jwt tokens                          | dfs&5few#%$                           |
| VERIFICATION_SECRET   | String secret string used to encrypt tokens sent in verification email   | fds*&534#%                            |
| PASSWORD_RESET_SECRET | Strong secret string used to encrypt tokens sent in reset password email | fsd()ed24d#%                          |
| SENTRY_DSN            | Sentry dsn                                                               | https://xxx-xxx-xxx@sentry.io/1513113 |
| FRONTEND_URL          | Front end application url, used to redirect sent mails to front-end      | http://localhost:5000                 |
| SMTP_HOST             | SMTP server host                                                         | smtp.gmail.com                        |
| SMTP_PORT             | SMTP server port                                                         | 25                                    |
| SMTP_USER             | SMTP server username                                                     | rashad                                |
| SMTP_PASS             | SMTP server password                                                     | 42#%2s@4                              |
| EMAIL_FROM            | When sending email, what is *from* field ?                               | noreply@todoapp.com                   |
| DB_URL                | Mongodb url                                                              | http://localhost:27017/todoapp        |
| ENABLE_CORS           | Enable cors white listing ?                                              | true                                  |
| CORS_WHITELIST        | Comma separated urls of cors whitelist                                   | http://example.com,example.com,api.io |


## Development
Provide a `.env` file in the root directory and run `yarn dev` to start the development server

## Test
Provide a `.env.test` file and run `yarn test`.

## API docs
You can build the api documentation by running `yarn build:docs`.

This will generate the docs in `./docs`.


## Production build
Provide a `.env.prod` file in the root directory and run `yarn build`.

After building finished, the build app will be in `./build` directory.

Run `yarn start` to start the built app.

## Deploy to heroku
Set `HEROKU_API_KEY` and `HEROKU_APP_NAME` environment variables.

Run `make deploy`.

### Note
If you are using circleci for deployment, then set the above variables in circleci project environment variables.

## Build docker image
Proivde a `.env.prod` file in the root directory but make sure you do not push the image to docker hub with this file in it, or don't provide it and pass the variables when spinning the container up.

Run `docker build . --tag tagname`

## Features

**Development features**:

- Scalable folder structure ([Fractal Structure](https://codeburst.io/fractal-a-nodejs-app-structure-for-infinite-scale-d74dda57ee11)).
- Code linters (Eslint).
- API Docs.
- [Sentry integration](https://sentry.io).
- .env files support.
- API tests.
- Continuous integration with Circleci.
- Continuous delevery with Circleci and heroku.
- Docker image.
- User input validation ([Joi](https://www.npmjs.com/package/@hapi/joi)).
- Security headers ([Helmet](https://www.npmjs.com/package/helmet)).
- Login attempts limit ([Express Brute](https://www.npmjs.com/package/express-brute)).
- Request rate limit (to prevent DDOS attacks) ([Express Rate Limit](https://www.npmjs.com/package/express-rate-limit)).

**App features**:

- Access tokens and Refresh tokens
- User signup with email and password.
- User login with email and password.
- User login with [Facebook](https://www.facebook.com).
- Account verification emails.
- Password recovery emails.
- Create new todo.
- List todo.
- Trash todo.
- Untrash todo.
- Delete todo permenantly.
- Complete todo.

## Todo
- Graphql API