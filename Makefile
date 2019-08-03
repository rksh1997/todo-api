IMAGE_TAG ?= rksh/todo

build:
	yarn install
	yarn build

deploy:
	git push https://heroku:${HEROKU_API_KEY}@git.heroku.com/${HEROKU_APP_NAME}.git/

docker:
	docker build . \
		--build-arg DB_URL=${DB_URL} \
		--build-arg SENTRY_DSN=${SENTRY_DSN} \
		--tag ${IMAGE_TAG}
