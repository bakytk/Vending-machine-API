<img src="https://i.ibb.co/16y7W7W/vending.jpg" width="300"><br/><br/>

**Vending-API**

_Guidelines_

- "seller" role to add, update or remove products
- "buyer" role can deposit coins into the machine and make purchases
- Your vending machine should only accept 5, 10, 20, 50 and 100 cent coins

> Product {
> productId,
> amountAvailable,
> cost,
> productName,
> sellerId
> }

> User {
> userId,
> username,
> password,
> deposit,
> role
> }

- JWT token valid 10min, if time elapsed more, use GET /user to re-login & fetch new access Bearer token
- 'productName' for Product is expected to be unique, as well as 'username' for User

> #1: sign-up:
> curl --location --request POST 'http://localhost:15500/user' --header 'Content-Type: application/json' --data-raw '{"username": "bak_buyer", "password": "1234", "role": "buyer"}'
> curl --location --request POST 'http://localhost:15500/user' --header 'Content-Type: application/json' --data-raw '{"username": "bak_seller", "password": "1234", "role": "seller" }'

> #2: sign-in
> curl --location --request GET 'http://localhost:15500/user' --header 'Content-Type: application/json' --data-raw '{"username": "bak_seller", "password": "1234" }'

> #3: create-product
> curl --location --request POST 'http://localhost:15500/product' \
> --header 'Content-Type: application/json' \
> --data-raw '{"productName": "Coke", "cost": 5, "amountAvailable": 20 }' \
> --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5Y2VjNTdlNS03NGE3LTRiMWMtYTIyMS0yZDM4MTk5NjE3ZWMiLCJyb2xlIjoic2VsbGVyIiwiaWF0IjoxNjc0MTYxODY1LCJleHAiOjE2NzQxNjI0NjV9.ZyK9k3Gkq2ztvtwYZKL3IZx-jBT_oGeKSJX87iPQWYU'

> #4: get-product
> curl --location --request GET 'http://localhost:15500/product' \
> --header 'Content-Type: application/json' \
> --data-raw '{"productName": "Coca-cola" }'

> #5: put-product: eg. change 'cost' to 10
> curl --location --request PUT 'http://localhost:15500/product' \
> --header 'Content-Type: application/json' \
> --data-raw '{"productName": "Coca-cola", "cost": 10}' \
> --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4MmI5NjM1OC1hZjc5LTRlYjAtOGNhYi1kYTNmOGRmMDYwNzQiLCJyb2xlIjoic2VsbGVyIiwiaWF0IjoxNjc0MTUxNzEwLCJleHAiOjE2NzQxNTIzMTB9.\_o6lUjzSdpaYuzhOzMwjKN1Yo0YPjd-5hAZn5ZlhNTc'

> #6: delete-product
> curl --location --request DELETE 'http://localhost:15500/product' \
> --header 'Content-Type: application/json' \
> --data-raw '{"productName": "Coca-cola"}' \
> --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4MmI5NjM1OC1hZjc5LTRlYjAtOGNhYi1kYTNmOGRmMDYwNzQiLCJyb2xlIjoic2VsbGVyIiwiaWF0IjoxNjc0MTUzNDcxLCJleHAiOjE2NzQxNTQwNzF9.W12yTw6RJAicGF03RVMgBvdrJMl1vSdLXDokUK6y8tY'

> #7: deposit
> curl --location --request POST 'http://localhost:15500/deposit' \
> --header 'Content-Type: application/json' \
> --data-raw '{"coin": 100 }' \
> --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhNDBlM2QzNy1jNzg1LTQyZTAtOGIwNy00OWM4YmU0OTg2MDkiLCJyb2xlIjoiYnV5ZXIiLCJpYXQiOjE2NzQxNjUwNTQsImV4cCI6MTY3NDE2NTY1NH0.VixrOIhzEahnME8dxbf7r_kdm_xlijCEKZPWMouqL2k'

> #8: buy
> curl --location --request POST 'http://localhost:15500/buy' \
> --header 'Content-Type: application/json' \
> --data-raw '{"productId": "9de15102-1f5e-4837-bc81-61cdc1c0816f", "amountProducts": 5 }' \
> --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhNDBlM2QzNy1jNzg1LTQyZTAtOGIwNy00OWM4YmU0OTg2MDkiLCJyb2xlIjoiYnV5ZXIiLCJpYXQiOjE2NzQxNjUwNTQsImV4cCI6MTY3NDE2NTY1NH0.VixrOIhzEahnME8dxbf7r_kdm_xlijCEKZPWMouqL2k'

> #9: reset
> curl --location --request POST 'http://localhost:15500/reset' \
> --header 'Content-Type: application/json' \
> --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhNDBlM2QzNy1jNzg1LTQyZTAtOGIwNy00OWM4YmU0OTg2MDkiLCJyb2xlIjoiYnV5ZXIiLCJpYXQiOjE2NzQxNjUwNTQsImV4cCI6MTY3NDE2NTY1NH0.VixrOIhzEahnME8dxbf7r_kdm_xlijCEKZPWMouqL2k'

> #10: logout
> curl --location --request POST 'http://localhost:15500/logout/all' \
> --header 'Content-Type: application/json' \
> --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyYWM0YjVjYy1mYWEwLTQzZDgtODAxMC00NjgwNzBlMzBiNzUiLCJyb2xlIjoic2VsbGVyIiwiaWF0IjoxNjc0MTY2NTU4LCJleHAiOjE2NzQxNjcxNTh9.0Atmq9afXTn6dB9tUMFrUeadNHAOfzznhtOyBgZB2UE'
