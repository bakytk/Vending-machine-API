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
    .get("/user")
    .set("content-type", "application/json")
    .send({
      username: "bak_buyer",
      password: "1234"
    })
    .then(function(res) {
      BUYER_TOKEN = res.body.access_token;
      done();
    })
    .catch(function(err) {
      done(err);
    });

  agent
    .get("/user")
    .set("content-type", "application/json")
    .send({
      username: "bak_seller",
      password: "1234"
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
        productName: `Random-product-${Math.floor(Math.random() * 1000)}`,
        amountAvailable: 20,
        cost: 10
      })
      .end(function(err, res) {
        //console.log("create product", res.should);
        res.should.have.status(200);
        done();
      });
  });
  it("MAKE deposit", function(done) {
    agent
      .post("/deposit")
      .set("authorization", `Bearer ${BUYER_TOKEN}`)
      .send({
        coin: 70
      })
      .end(function(err, res) {
        res.should.have.status(200);
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
        console.log("movies list", res.body);
        res.should.have.status(200);
        done();
      });
  });
});

after(function() {
  agent.close();
});
