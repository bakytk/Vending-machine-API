FROM node:10-alpine

ADD . /vending-app
WORKDIR /vending-app

COPY package*.json ./vending-app/
RUN npm install

#COPY --chown=node:node . .

EXPOSE 15500

CMD [ "npm", "start" ]
