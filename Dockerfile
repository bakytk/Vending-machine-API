FROM node:10-alpine

ADD . /redis-app
WORKDIR /redis-app

COPY package*.json ./redis-app/
RUN npm install

#COPY --chown=node:node . .

EXPOSE 11000

CMD [ "npm", "start" ]
