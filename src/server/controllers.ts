const JWT_SECRET: string = process.env.JWT_SECRET || "";
const COIN_VALUES: Number[] = [5, 10, 20, 50, 100];

import { COOKIE_NAME } from "./constants";
import { TokenData } from "../types/index";
import jwt from "jsonwebtoken";
import { uuid } from "uuidv4";

if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET env");
}

import connect from "../db/connect";
import { User, Product } from "../db/models";
import { IUser } from "../types/index";
import { DB_URL } from "../db/config";
connect({ DB_URL });

function changeCoins(value: number): number[] {
  /*
    greedy approach: largest coins first
  */
  let len: number = COIN_VALUES.length;
  let change: number[] = new Array(len).fill(0);
  let coin, quotient, rem;
  for (let i = len - 1; i > -1; i--) {
    coin = COIN_VALUES[i];
    quotient = Math.floor(value / coin);
    if (i === 0) {
      change[0] = Math.floor(value / coin);
    } else if (quotient > 0) {
      change[i] = quotient;
      value = value - quotient * coin;
    }
  }
  return change;
}

export const controllers = {
  fallback: async (req, res) => {
    return res.status(405).json({ message: "Invalid endpoint or method" });
  },

  ping: async (req, res) => {
    console.log("ping req", req);
    return res.status(200).json({ message: "Pong!" });
  },

  signup: async (req, res) => {
    try {
      let { username, password, role } = req.body;
      //console.log("req.body", req.body);
      if (!(username && password && role)) {
        return res
          .status(406)
          .send("Either of 'username-password-role' is absent!");
      }
      if (!(role === "buyer" || role === "seller")) {
        return res.status(406).send("Invalid role!");
      }
      let userId: string = uuid();
      let data = {
        username,
        password,
        userId,
        role
      };
      let user = new User({
        ...data
      });
      await user.save();
      let tokenData: TokenData = {
        userId,
        role
      };
      let token: string = jwt.sign(tokenData, JWT_SECRET, { expiresIn: "30m" });
      res.status(201).json({
        message: "Successful registration!",
        access_token: token,
        userId
      });
    } catch (e) {
      console.log("signup error", e);
      res.status(500).send(`Signup error`);
    }
  },

  //if signedIn, throw
  signin: async (req, res) => {
    try {
      let { username, password } = req.query;
      if (!(username && password)) {
        return res.status(406).send("Username or password absent!");
      }
      let user = await User.find({
        username,
        password
      });
      if (!(user.length > 0)) {
        return res.status(401).send("Username not found!");
      }
      //console.log("fetched user", user);
      let { password: db_password, role, userId, deposit } = user[0];
      if (db_password != password) {
        return res.status(401).send("Incorrect password!");
      }
      if (req.session.userid) {
        return res
          .status(401)
          .send("There is already an active session using your account. ");
      }
      req.session.userid = userId;
      let tokenData: TokenData = {
        userId,
        role
      };
      let token: string = jwt.sign(tokenData, JWT_SECRET, { expiresIn: "30m" });
      res.json({
        message: "Successful authentication!",
        access_token: token,
        userId,
        deposit
      });
    } catch (e) {
      console.log("signin error", e);
      res.status(500).send(`Signin error: ${e.message}`);
    }
  },

  createProduct: async (req, res) => {
    try {
      let { userId, role } = req.decode;
      if (!(userId && role === "seller")) {
        return res.status(406).send("'userId or role' not validated");
      }
      if (role !== "seller") {
        return res.status(406).send("Action not valid for role");
      }

      //checkSession
      if (!(req.session.userid && req.session.userid === userId)) {
        return res.status(401).send("Session not authorized.");
      }

      //product crud
      let { productName, amountAvailable, cost } = req.body;
      if (!(productName && amountAvailable && cost)) {
        return res
          .status(406)
          .send(
            "One of 'productName, amountAvailable, cost' params not passed"
          );
      }
      let productId: string = uuid();
      let product = new Product({
        productId,
        productName,
        amountAvailable: Number(amountAvailable),
        cost: Number(cost),
        sellerId: userId
      });
      console.log("creating product:", product);
      await product.save();
      let product_array = await Product.find({ productId });
      console.log("retrieving product:", product_array);
      return res.status(201).json({
        message: "Product successfully created!",
        data: { productId }
      });
    } catch (e) {
      console.error("createProduct error", e);
      res.status(500).send(`createProduct error: ${e.message}`);
    }
  },

  getProduct: async (req, res) => {
    try {
      let { id: productId } = req.params;
      if (!productId) {
        return res.status(406).send("'productId' urlParam not passed!");
      } else {
        productId = productId.trim();
      }

      //checkSession
      if (!req.session.userid) {
        return res.status(401).send("Session not authorized.");
      }

      //product crud
      let product = await Product.find({ productId });
      if (!(product.length > 0)) {
        return res.status(404).send("Product not found!");
      }
      let { productName, amountAvailable, cost, sellerId } = product[0];
      return res.json({
        data: {
          productName,
          amountAvailable,
          cost
        }
      });
    } catch (e) {
      console.error("getProduct error", e);
      res.status(500).send(`getProduct error: ${e.message}`);
    }
  },

  putProduct: async (req, res) => {
    try {
      //step 1. check if we have userId & role
      let { userId, role } = req.decode;
      //console.log("userId, role", userId, role);
      if (!(userId && role === "seller")) {
        return res.status(401).send("'userId or role' not validated");
      }

      //checkSession
      if (!(req.session.userid && req.session.userid === userId)) {
        return res.status(401).send("Session not authorized.");
      }

      //step 2. parse productName & search for it
      let { id: productId } = req.params;
      if (!productId) {
        return res.status(406).send("'productId' urlParam not passed!");
      } else {
        productId = productId.trim();
      }

      //step 3. check if body not null & seller is authorized
      console.log("productId", productId);
      if (!req.body) {
        return res.status(406).send("request body is empty!");
      }
      let product = await Product.findOne({ productId });
      if (!(product.length > 0)) {
        return res.status(404).send("Product not found!");
      }
      let { sellerId: db_sellerId } = product[0];
      if (!(userId === db_sellerId && role === "seller")) {
        res.status(406).send("Either role or sellerId is ineligible!");
      }

      //step 4.update
      let fields: string[] = [
        "productName",
        "amountAvailable",
        "cost",
        "sellerId"
      ];
      let updateData: any = {};
      for (let item of fields) {
        //console.log("item:", item);
        if (req.body[item]) {
          if (item === "cost") {
            let cost: number = Number(req.body[item]);
            if (cost <= 0 || cost % 5 != 0) {
              res
                .status(406)
                .send(`Cost value must be positive & multiple of 5`);
            }
            updateData[item] = Number(req.body[item]);
          } else if (item === "amountAvailable") {
            updateData[item] = Number(req.body[item]);
          } else {
            updateData[item] = req.body[item];
          }
        }
      }
      if (Object.keys(updateData).length === 0) {
        return res.status(406).send(`Expected update params not received!`);
      }
      await Product.findOneAndUpdate({ productId }, { ...updateData });
      return res.status(204).json({ message: "Product successfully updated!" });
    } catch (e) {
      console.error("putProduct", e);
      res.status(500).send(`putProduct error: ${e.message}`);
    }
  },

  deleteProduct: async (req, res) => {
    try {
      //step 1. check if we have userId & role
      let { userId, role } = req.decode;
      if (!(userId && role === "seller")) {
        return res.status(401).send("'userId or role' not validated");
      }

      //checkSession
      if (!(req.session.userid && req.session.userid === userId)) {
        return res.status(401).send("Session not authorized.");
      }

      //step 2. read productId
      let { id: productId } = req.params;
      if (!productId) {
        return res.status(406).send("'productId' urlParam not passed!");
      } else {
        productId = productId.trim();
      }
      let product = await Product.find({
        productId
      });
      if (!(product.length > 0)) {
        return res.status(404).send("ProductId not found!");
      }

      //check sellerId match
      let { sellerId: db_sellerId } = product[0];
      if (!(userId === db_sellerId && role === "seller")) {
        return res.status(401).send("Either role or sellerId is ineligible!");
      }
      await Product.deleteOne({ productId });
      return res.status(202).json({ message: "Product successfully deleted!" });
    } catch (e) {
      console.error("deleteProduct error", e);
      res.status(500).send(`deleteProduct error: ${e.message}`);
    }
  },

  deposit: async (req, res) => {
    try {
      let { coin } = req.body;
      if (!coin) {
        res.status(406).send("'coin' value not passed.");
      }
      if (!COIN_VALUES.includes(Number(coin))) {
        res.status(406).send("Provided coin value is ineligible.");
      }
      let { userId, role } = req.decode;
      //console.log("userId, role", userId, role);
      if (!(userId && role === "buyer")) {
        res.status(401).send("'userId or role' not validated");
      }

      //checkSession
      if (!(req.session.userid && req.session.userid === userId)) {
        res.status(401).send("Session not authorized.");
      }

      //update balance
      let user = await User.find({ userId });
      if (!(user.length > 0)) {
        throw new Error("UserId not found!");
      }
      let { deposit } = user[0];
      deposit += Number(coin);
      await User.findOneAndUpdate({ userId }, { deposit });
      return res.status(204).json({
        message: "Coin successfully deposited!",
        data: {
          userId,
          deposit
        }
      });
    } catch (e) {
      console.error("deposit error", e);
      res.status(500).send(`deposit error: ${e.message}`);
    }
  },

  buy: async (req, res) => {
    try {
      let { productId, amountProducts } = req.body;
      if (!(productId && amountProducts)) {
        res.status(406).send("'productId or amountProducts' params not passed");
      }
      let { userId, role } = req.decode;
      console.log("productId, amountProducts");
      res.status(401).send("'userId or role' not validated");
      if (!(userId && role === "buyer")) {
      }

      //checkSession
      if (!(req.session.userid && req.session.userid === userId)) {
        res.status(401).send("Session not authorized.");
      }

      //check if there are enough items
      let product = await Product.find({
        productId
      });
      if (!(product.length > 0)) {
        res.status(401).send("Product not found!");
      }
      //console.log("product", product[0]);
      let { cost, amountAvailable } = product[0];
      if (amountAvailable < Number(amountProducts)) {
        throw new Error("Insufficient product stock for the purchase.");
      }

      //check if deposit enough for purchase
      let user = await User.find({ userId });
      if (!(user.length > 0)) {
        res.status(401).send("UserId not found!");
      }
      let { deposit } = user[0];
      let totalCost = cost * Number(amountProducts);
      if (deposit < totalCost) {
        throw new Error("Insufficient deposit for the purchase.");
      }

      //make transaction & reset deposit to zero after change flush
      let remainder = deposit - totalCost;
      let change = changeCoins(remainder);
      deposit = 0;
      await User.findOneAndUpdate({ userId }, { deposit });

      //debit Product stock
      amountAvailable -= Number(amountProducts);
      await Product.findOneAndUpdate({ productId }, { amountAvailable });
      return res.status(204).json({
        message: "Purchase is successfully transacted!",
        data: {
          productId,
          totalCost,
          change
        }
      });
    } catch (e) {
      console.error("buy error", e);
      res.status(500).send(`buy error: ${e.message}`);
    }
  },

  reset: async (req, res) => {
    try {
      let { userId, role } = req.decode;
      //console.log("userId, role", userId, role);
      if (!(userId && role === "buyer")) {
        res.status(401).send("'userId or role' not validated");
      }

      //checkSession
      if (!(req.session.userid && req.session.userid === userId)) {
        res.status(401).send("Session not authorized.");
      }

      let deposit = 0;
      await User.findOneAndUpdate({ userId }, { deposit });
      return res.status(204).json({
        message: "User deposit reset!"
      });
    } catch (e) {
      console.error("deposit error", e);
      res.status(500).send(`deposit error: ${e.message}`);
    }
  },

  logout: async (req, res) => {
    try {
      let { userId } = req.decode;
      if (!userId) {
        res.status(401).send("'userId' not validated");
      }
      req.session.destroy();
      return res
        .status(204)
        .clearCookie(COOKIE_NAME)
        .json({
          message: "User logged out!"
        });
    } catch (e) {
      console.error("logout error", e);
      res.status(500).send(`logout error: ${e.message}`);
    }
  }
};
