FROM ghcr.io/gravity-ui/node-nginx:ubuntu20-nodejs18

RUN mkdir -p /opt/app

WORKDIR /opt/app

COPY . .

RUN npm ci
RUN npm run build:client

COPY ./deploy/nginx /etc/nginx
