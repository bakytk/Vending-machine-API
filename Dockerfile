# build step
FROM node:14-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY tsconfig*.json ./
COPY src src
RUN npm run build

# run step
FROM node:14-alpine
ENV NODE_ENV=production
# more info: https://github.com/krallin/tini
# RUN apk add --no-cache tini
WORKDIR /usr/src/app
# RUN chown node:node .
# USER node
COPY package*.json ./
RUN npm install
COPY --from=builder /usr/src/app/dist/ dist/
EXPOSE 15500
ENTRYPOINT [ "node", "dist/server.js" ]
#ENTRYPOINT [ "/sbin/tini","--", "node", "dist/server.js" ]
