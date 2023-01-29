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
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN ls -al
COPY --from=builder /usr/src/app/dist/ dist/
EXPOSE 15500
ENTRYPOINT [ "node", "dist/server/index.js" ]
