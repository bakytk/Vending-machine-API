import { describe, it } from "mocha";
import chai from "chai";
import chaiHttp from "chai-http";
import server from "../src/server/index.js";
const should = chai.should();
chai.use(chaiHttp);

//deposit, buy, one-crud

const agent = chai.request.agent(server);
let BUYER_TOKEN = "";
let SELLER_TOKEN = "";
let PRODUCT_ID = "";

before(function(done) {
  agent
    .post("/user")
    .set("content-type", "application/json")
    .send({
      username: `Buyer-${Math.floor(Math.random() * 10000)}`,
      password: "1234",
      role: "buyer"
    })
    .then(function(res) {
      BUYER_TOKEN = res.body.access_token;
      //done();
    })
    .catch(function(err) {
      done(err);
    });

  agent
    .post("/user")
    .set("content-type", "application/json")
    .send({
      username: `Seller-${Math.floor(Math.random() * 10000)}`,
      password: "1234",
      role: "seller"
    })
    .then(function(res) {
      SELLER_TOKEN = res.body.access_token;
      done();
    })
    .catch(function(err) {
      done(err);
    });
});

describe("vending-machine", function() {
  it("CREATE product", function(done) {
    agent
      .post("/product")
      .set("authorization", `Bearer ${SELLER_TOKEN}`)
      .send({
        productName: `Product-${Math.floor(Math.random() * 10000)}`,
        amountAvailable: 20,
        cost: 10
      })
      .end(function(err, res) {
        console.log("createProduct response", res.body.data);
        PRODUCT_ID = res.body.data.productId;
        res.should.have.status(200);
        done();
      });
  });

  it("MAKE deposit", function(done) {
    agent
      .post("/deposit")
      .set("authorization", `Bearer ${BUYER_TOKEN}`)
      .send({
        coin: 100 //70
      })
      .end(function(err, res) {
        console.log("deposit response", res.body.data);
        res.body.data.deposit.should.gt(0);
        done();
      });
  });

  it("BUY product", function(done) {
    agent
      .post("/buy")
      .set("authorization", `Bearer ${BUYER_TOKEN}`)
      .send({
        productId: PRODUCT_ID,
        amountProducts: 2
      })
      .end(function(err, res) {
        console.log("buyProduct response:", res.body.data);
        res.should.have.status(200);
        done();
      });
  });
});

after(function() {
  agent.close();
});
