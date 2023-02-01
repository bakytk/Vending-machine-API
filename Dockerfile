# build step
FROM node:14-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig*.json ./
COPY src src
COPY run.sh ./
COPY test.sh ./
RUN chmod +x run.sh
RUN chmod +x test.sh
RUN npm run build

# run step
FROM node:14-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
COPY run.sh ./
COPY test.sh ./
RUN npm install
COPY --from=builder /app/dist/ dist/
EXPOSE 15500
ENTRYPOINT ["sh", "run.sh"]
#CMD [ "node", "dist/server/index.js", "&&", "npm", "run", "test"]
