
<img src="https://i.ibb.co/nkPwLBg/redis.jpg" width="500"><br/><br/>


**Redis-API**


The purpose of this app is to build a CRUD API on Express.js, that keeps transactions (product queries) in Redis database. The app is containerized with Docker Compose.

The script is relatively straightforward and organized with self-explanatory file names and folders. To run it, just unzip the file and run the following:

`
npm install
docker-compose up
`

The _logic of the endpoints_ and some clarification what they do:

1) **POST** endpoint: `/products`

- this endpoint expects a single, mandatory field `company` in the body, specifying to which company/client, the product belongs to. Use Postman, to test the script setting the following:

`
Content-type: application/json
Raw body:
{
    "company": "York restaurant"
}
`

All other product fields are generated automatically or set statically. The server responds with `product_id`, which can be used to manage product data in other endpoints. This `product_id` is used inter-changibly with `container_id`, since by the business logic each product when accepted is matched to a unique container_id

2) **GET** endpoint: `/products`

- this endpoint also requires `company` as a mandatory field, and returns all the products that were accepted to storage under the name of this company

`
Content-type: application/json
Raw body:
{
    "company": "York restaurant"
}
`

3) **GET** endpoint: `/product`

- this endpoint requires `product_id` as a mandatory field, and returns information on specific product, so in Postman use the following query:

`
Content-type: application/json
Raw body:
{
    "product_id": "use-here-product-id-returned-from-POST-request"
}
`

4) **PUT** endpoint: `/product`

- this endpoint requires `product_id` and `company` as mandatory fields.
- the logic here is that we can change only one attribute, `company`, for the purpose of this app
- the rationale is that companies like restaurant can swap product ownership between each other: some restaurants may expect high-season and need more, for examples, tables, while others expect to scale down operations
- so in Postman use the following query:

`
Content-type: application/json
Raw body:
{
    "product_id": "use-here-product-id-returned-from-POST-request",
    "company": "New owner company name"
}
`

5) **DELETE** endpoint: `/product`

- this is the most straightforward endpoint, deleting any one product from db by id:

`
Content-type: application/json
Raw body:
{
    "product_id": "use-here-product-id-returned-from-POST-request"
}
`
