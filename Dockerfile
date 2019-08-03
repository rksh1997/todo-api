FROM node:10-alpine

LABEL MAINTAINER="Rashad Kokash"

WORKDIR /app

COPY . .

RUN yarn install && yarn build

ARG DB_URL
ARG SENTRY_DSN

ENV DB_URL=$DB_URL
ENV PORT 8080
ENV SENTRY_DSN=$SENTRY_DSN

EXPOSE 8080

CMD [ "node", "build/index.js" ]