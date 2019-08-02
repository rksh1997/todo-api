FROM node:10-alpine

LABEL MAINTAINER="Rashad Kokash"

WORKDIR /app

COPY . .

RUN yarn install && yarn build

ENV DB_URL ${DB_URL}
ENV PORT 8080
ENV SENTRY_DSN ${SENTRY_DSN}

EXPOSE 8080

CMD [ "yarn", "start" ]