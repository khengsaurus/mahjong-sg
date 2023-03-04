FROM node:18.14.2

WORKDIR /app

COPY . .
RUN yarn install

EXPOSE 3000

CMD yarn build && yarn start-docker
