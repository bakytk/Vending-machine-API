FROM node:14-alpine

ADD . /vending-app
WORKDIR /vending-app

COPY package*.json ./vending-app/
COPY nodemon.json ./vending-app/
RUN npm install

EXPOSE 15500
CMD [ "npm", "run", "dev" ]
