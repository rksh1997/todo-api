FROM node:10-alpine

LABEL MAINTAINER="Rashad Kokash"

WORKDIR /app

COPY . .

RUN yarn install && yarn build

CMD [ "yarn", "start" ]