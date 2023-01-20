<img src="https://i.ibb.co/16y7W7W/vending.jpg" width="300"><br/><br/>

### Vending-API

##### Start & testt

```
# start containers
docker-compose up --build [-d]
# curl commands listed below

# testing
docker compose -f docker-compose.yml build vending_app
docker compose -f docker-compose.yml run vending_app npm run test
```

##### Guidelines

- "seller" role to add, update or remove products
- "buyer" role can deposit coins into the machine and make purchases
- Your vending machine should only accept 5, 10, 20, 50 and 100 cent coins
- JWT token valid 10min, if time elapsed more, use GET /user to re-login & fetch new access Bearer token
- 'productName' for Product is expected to be unique, as well as 'username' for User

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
curl --location --request GET 'http://localhost:15500/user' --header 'Content-Type: application/json' --data-raw '{"username": "bak_seller", "password": "1234" }'

#3: create-product
curl --location --request POST 'http://localhost:15500/product' \
--header 'Content-Type: application/json' \
--data-raw '{"productName": "Coke", "cost": 5, "amountAvailable": 20 }' \
--header 'Authorization: Bearer JWT_TOKEN'

#4: get-product
curl --location --request GET 'http://localhost:15500/product' \
--header 'Content-Type: application/json' \
--data-raw '{"productName": "Coca-cola" }'

#5: put-product: eg. change 'cost' to 10
curl --location --request PUT 'http://localhost:15500/product' \
--header 'Content-Type: application/json' \
--data-raw '{"productName": "Coca-cola", "cost": 10}' \
--header 'Authorization: Bearer JWT_TOKEN'

#6: delete-product
curl --location --request DELETE 'http://localhost:15500/product' \
--header 'Content-Type: application/json' \
--data-raw '{"productName": "Coca-cola"}' \
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
