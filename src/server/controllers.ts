const JWT_SECRET: string = process.env.JWT_SECRET || "";
const COIN_VALUES: Number[] = [5, 10, 20, 50, 100];

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
  let len: number = COIN_VALUES.length;
  let change: number[] = new Array(len).fill(0);
  let coin, quotient, rem;
  for (let i = len - 1; i > -1; i--) {
    coin = COIN_VALUES[i];
    quotient = Math.floor(value / coin);
    if (i === 0) {
      change[0] = value;
    } else if (quotient > 0) {
      change[i] = quotient;
      value = value % coin;
    }
  }
  return change;
}

export const controllers = {
  fallback: async (req, res) => {
    return res.status(401).json({ message: "Invalid endpoint or method" });
  },

  ping: async (req, res) => {
    return res.status(200).json({ message: "Pong!" });
  },

  signup: async (req, res) => {
    try {
      let { username, password, role } = req.body;
      //console.log("req.body", req.body);
      if (!(username && password && role)) {
        throw new Error("Either of 'username-password-role' is absent!");
      }
      if (!(role === "buyer" || role === "seller")) {
        throw new Error("Invalid role!");
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
      res.json({
        message: "Successful registration!",
        access_token: token,
        userId
      });
    } catch (e) {
      console.log("signup error", e);
      res.send(`Signup error`);
    }
  },

  //if signedIn, throw
  signin: async (req, res) => {
    try {
      let { username, password } = req.body;
      if (!(username && password)) {
        throw new Error("Username or password absent!");
      }
      let user = await User.find({
        username,
        password
      });
      //console.log("user", user);
      if (!(user.length > 0)) {
        throw new Error("Username not found!");
      }
      //console.log("fetched user", result);
      let { password: db_password, role, userId, deposit, signedIn } = user[0];
      if (signedIn) {
        throw new Error(
          "There is already an active session using your account"
        );
      }
      if (db_password != password) {
        throw new Error("Incorrect password!");
      }
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
      res.send(`Signin error: ${e.message}`);
    }
  },

  createProduct: async (req, res) => {
    try {
      let { userId, role } = req.decode;
      //console.log("userId, role", userId, role);
      if (!(userId && role === "seller")) {
        throw new Error("'userId or role' not validated");
      }
      if (role !== "seller") {
        throw new Error("Action not valid for role");
      }
      let { productName, amountAvailable, cost } = req.body;
      if (!(productName && amountAvailable && cost)) {
        throw new Error(
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
      console.log("product", product);
      await product.save();
      return res.json({
        message: "Product successfully created!",
        data: { productId }
      });
    } catch (e) {
      console.error("createProduct error", e);
      res.send(`createProduct error: ${e.message}`);
    }
  },

  getProduct: async (req, res) => {
    try {
      let { id: productId } = req.params;
      if (!productId) {
        throw new Error("'productId' urlParam not passed!");
      } else {
        productId = productId.trim();
      }
      let product = await Product.find({ productId });
      if (!(product.length > 0)) {
        throw new Error("Product not found!");
      }
      let { productName, amountAvailable, cost, sellerId } = product[0];
      return res.json({
        data: {
          productName,
          amountAvailable,
          cost,
          sellerId
        }
      });
    } catch (e) {
      console.error("getProduct error", e);
      res.send(`getProduct error: ${e.message}`);
    }
  },

  putProduct: async (req, res) => {
    try {
      //step 1. check if we have userId & role
      let { userId, role } = req.decode;
      //console.log("userId, role", userId, role);
      if (!(userId && role === "seller")) {
        throw new Error("'userId or role' not validated");
      }

      //step 2. parse productName & search for it
      let { id: productId } = req.params;
      if (!productId) {
        throw new Error("'productId' urlParam not passed!");
      } else {
        productId = productId.trim();
      }

      //step 3. check if body not null & seller is authorized
      if (!req.body) {
        throw new Error("request body is empty!");
      }
      let product = await Product.find({ productId });
      if (!(product.length > 0)) {
        throw new Error("Product not found!");
      }
      let { sellerId: db_sellerId } = product[0];
      if (!(userId === db_sellerId && role === "seller")) {
        throw new Error("Either role or sellerId is ineligible!");
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
        console.log("item:", item);
        if (req.body[item]) {
          if (item === "cost") {
            let cost: number = Number(req.body[item]);
            if (cost <= 0 || cost % 5 != 0) {
              throw new Error(`Cost value must be positive & multiple of 5`);
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
        throw new Error(`Expected update params not received!`);
      }
      await Product.findOneAndUpdate({ productId }, { ...updateData });
      return res.status(200).json({ message: "Product successfully updated!" });
    } catch (e) {
      console.error("putProduct", e);
      res.send(`putProduct error: ${e.message}`);
    }
  },

  deleteProduct: async (req, res) => {
    try {
      //step 1. check if we have userId & role
      let { userId, role } = req.decode;
      if (!(userId && role === "seller")) {
        throw new Error("'userId or role' not validated");
      }

      //step 2. read productId
      let { id: productId } = req.params;
      if (!productId) {
        throw new Error("'productId' urlParam not passed!");
      } else {
        productId = productId.trim();
      }
      let product = await Product.find({
        productId
      });
      if (!(product.length > 0)) {
        throw new Error("ProductId not found!");
      }

      //check sellerId match
      let { sellerId: db_sellerId } = product[0];
      if (!(userId === db_sellerId && role === "seller")) {
        throw new Error("Either role or sellerId is ineligible!");
      }
      await Product.deleteOne({ productId });
      return res.status(200).json({ message: "Product successfully deleted!" });
    } catch (e) {
      console.error("deleteProduct error", e);
      res.send(`deleteProduct error: ${e.message}`);
    }
  },

  deposit: async (req, res) => {
    try {
      let { coin } = req.body;
      if (!coin) {
        throw new Error("'coin' value not passed.");
      }
      if (!COIN_VALUES.includes(Number(coin))) {
        throw new Error("Provided coin value is ineligible.");
      }
      let { userId, role } = req.decode;
      //console.log("userId, role", userId, role);
      if (!(userId && role === "buyer")) {
        throw new Error("'userId or role' not validated");
      }

      //Get currentBalance of Deposit
      let user = await User.find({
        userId
      });
      if (!(user.length > 0)) {
        throw new Error("User not found!");
      }
      let { deposit } = user[0];
      deposit += Number(coin);
      await User.findOneAndUpdate({ userId }, { deposit });
      return res.json({
        message: "Coin successfully deposited!",
        data: {
          userId,
          deposit
        }
      });
    } catch (e) {
      console.error("deposit error", e);
      res.send(`deposit error: ${e.message}`);
    }
  },

  buy: async (req, res) => {
    try {
      let { productId, amountProducts } = req.body;
      if (!(productId && amountProducts)) {
        throw new Error("'productId or amountProducts' params not passed");
      }
      let { userId, role } = req.decode;
      console.log("productId, amountProducts");
      if (!(userId && role === "buyer")) {
        throw new Error("'userId or role' not validated");
      }

      //Retrieve user deposit value
      let user = await User.find({
        userId
      });
      if (!(user.length > 0)) {
        throw new Error("User not found!");
      }
      let { deposit } = user[0];

      //check if there are enough items
      let product = await Product.find({
        productId
      });
      if (!(product.length > 0)) {
        throw new Error("Product not found!");
      }
      //console.log("product", product[0]);
      let { cost, amountAvailable } = product[0];
      if (amountAvailable < Number(amountProducts)) {
        throw new Error("Insufficient product stock for the purchase.");
      }

      //check if deposit enough for purchase
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
      await User.findOneAndUpdate({ productId }, { amountAvailable });
      return res.json({
        message: "Purchase is successfully transacted!",
        data: {
          productId,
          totalCost,
          change
        }
      });
    } catch (e) {
      console.error("buy error", e);
      res.send(`buy error: ${e.message}`);
    }
  },

  reset: async (req, res) => {
    try {
      let { userId, role } = req.decode;
      //console.log("userId, role", userId, role);
      if (!(userId && role === "buyer")) {
        throw new Error("'userId or role' not validated");
      }

      //Get currentBalance of Deposit
      let user = await User.find({
        userId
      });
      if (!(user.length > 0)) {
        throw new Error("User not found!");
      }
      let deposit = 0;
      await User.findOneAndUpdate({ userId }, { deposit });
      return res.json({
        message: "User deposit reset!"
      });
    } catch (e) {
      console.error("deposit error", e);
      res.send(`deposit error: ${e.message}`);
    }
  }

  /*
  logout: async (req, res) => {
    try {
      let { userId } = req.decode;
      if (!userId) {
        throw new Error("'userId' not validated");
      }
      let user = await User.find({
        userId
      });
      if (!(user.length > 0)) {
        throw new Error("User not found!");
      }
      await User.findOneAndUpdate({ userId }, { signedIn: false });
      return res.json({
        message: "User logged out!"
      });
    } catch (e) {
      console.error("logout error", e);
      res.send(`logout error: ${e.message}`);
    }
  }
  */
};
