"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var mocha_1 = require("mocha");
var chai_1 = __importDefault(require("chai"));
var chai_http_1 = __importDefault(require("chai-http"));
var index_1 = __importDefault(require("../server/index"));
var should = chai_1["default"].should();
chai_1["default"].use(chai_http_1["default"]);
//deposit, buy, one-crud
var agent = chai_1["default"].request.agent(index_1["default"]);
var BUYER_TOKEN = "";
var SELLER_TOKEN = "";
var PRODUCT_ID = "";
before(function (done) {
    agent
        .post("/user")
        .set("content-type", "application/json")
        .send({
        username: "Buyer-".concat(Math.floor(Math.random() * 10000)),
        password: "1234",
        role: "buyer"
    })
        .then(function (res) {
        BUYER_TOKEN = res.body.access_token;
        //done();
    })["catch"](function (err) {
        done(err);
    });
    agent
        .post("/user")
        .set("content-type", "application/json")
        .send({
        username: "Seller-".concat(Math.floor(Math.random() * 10000)),
        password: "1234",
        role: "seller"
    })
        .then(function (res) {
        SELLER_TOKEN = res.body.access_token;
        done();
    })["catch"](function (err) {
        done(err);
    });
});
(0, mocha_1.describe)("vending-machine", function () {
    (0, mocha_1.it)("CREATE product", function (done) {
        agent
            .post("/product")
            .set("authorization", "Bearer ".concat(SELLER_TOKEN))
            .send({
            productName: "Product-".concat(Math.floor(Math.random() * 10000)),
            amountAvailable: 20,
            cost: 5
        })
            .end(function (err, res) {
            console.log("createProduct response", res.body.data);
            PRODUCT_ID = res.body.data.productId;
            res.should.have.status(200);
            done();
        });
    });
    (0, mocha_1.it)("MAKE deposit", function (done) {
        agent
            .post("/deposit")
            .set("authorization", "Bearer ".concat(BUYER_TOKEN))
            .send({
            coin: 100 //70
        })
            .end(function (err, res) {
            console.log("deposit response", res.body.data);
            res.body.data.deposit.should.gt(0);
            done();
        });
    });
    (0, mocha_1.it)("BUY product", function (done) {
        agent
            .post("/buy")
            .set("authorization", "Bearer ".concat(BUYER_TOKEN))
            .send({
            productId: PRODUCT_ID,
            amountProducts: 3
        })
            .end(function (err, res) {
            console.log("buyProduct response:", res.body.data);
            res.body.data.should.eql([1, 1, 1, 1, 0]);
            done();
        });
    });
});
after(function () {
    agent.close();
});
//# sourceMappingURL=index.js.map