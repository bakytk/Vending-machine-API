<img src="https://i.ibb.co/16y7W7W/vending.jpg" width="300"><br/><br/>

### Vending-API

##### Guidelines

- There are two roles in this API: `seller` who can create products & `buyer` to purchase them
- `seller` should have support for all CRUD ops: including:
  1.  CREATE a product;
  1.  UPDATE product [by urlencoded `productId`]
  1.  GET product info [by urlencoded `productId`]
  1.  DELETE product [by urlencoded `productId`]
- Assume buyers can insert coins of values `[5,10,20,50,100]` into the vending machine
- Buyers can purchase products only one at a time
- 'productName' for Product is expected to be unique, as well as 'username' for User
- User authentication is implemented with JWT tokens valid 30min [for demo]
- Session tracked for each user, persisting with `connect-mongo`

##### Develop, test and build

```
# start Mongo database:
docker-compose up mongo_db

# START: Express app, and send sample curl below or
# collection of Postman requests  [included in a separate repo for convenience as json file]
npm start

# TEST: 3 tests:
# 1) create product with price=$5;
# 2) make deposit of $100,
# 3) buy 3 items, expecting 'change' array= [1,1,1,1,0]
npm test

# BUILD
docker-compose up --build [-d]
```

##### Schemas

```
Product {
productId,
amountAvailable,
cost,
productName,
sellerId
}

User {
userId,
username,
password,
deposit,
role
}
```

##### cURL commands

```
#1: sign-up:
curl --location --request POST 'http://localhost:15500/user' --header 'Content-Type: application/json' --data-raw '{"username": "bak_buyer", "password": "1234", "role": "buyer"}'

curl --location --request POST 'http://localhost:15500/user' --header 'Content-Type: application/json' --data-raw '{"username": "bak_seller", "password": "1234", "role": "seller" }'

#2: sign-in
curl --location --request GET 'http://localhost:15500/user?username=bak_seller&password=1234'

#3: create-product
curl --location --request POST 'http://localhost:15500/product' \
--header 'Content-Type: application/json' \
--data-raw '{"productName": "Coke", "cost": 5, "amountAvailable": 20 }' \
--header 'Authorization: Bearer JWT_TOKEN'

#4: get-product
curl --location --request GET 'http://localhost:15500/product/<PRODUCT_ID>'

#5: put-product: eg. change 'cost' to 10
curl --location --request PUT 'http://localhost:15500/product/<PRODUCT_ID>' \
--header 'Content-Type: application/json' \
--data-raw '{"productName": "Coca-cola", "cost": 10}' \
--header 'Authorization: Bearer JWT_TOKEN'

#6: delete-product
curl --location --request DELETE 'http://localhost:15500/product/<PRODUCT_ID>' \
--header 'Authorization: Bearer JWT_TOKEN'

#7: deposit
curl --location --request POST 'http://localhost:15500/deposit' \
--header 'Content-Type: application/json' \
--data-raw '{"coin": 100 }' \
--header 'Authorization: Bearer JWT_TOKEN'

#8: buy
curl --location --request POST 'http://localhost:15500/buy' \
--header 'Content-Type: application/json' \
--data-raw '{"productId": "9de15102-1f5e-4837-bc81-61cdc1c0816f", "amountProducts": 5 }' \
--header 'Authorization: Bearer JWT_TOKEN'

#9: reset
curl --location --request POST 'http://localhost:15500/reset' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer JWT_TOKEN'

#10: logout
curl --location --request POST 'http://localhost:15500/logout/all' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer JWT_TOKEN'
```
