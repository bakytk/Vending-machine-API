const { JWT_SECRET } = process.env;
const COIN_VALUES = [5, 10, 20, 50, 100];

import db from "../db/index.js";
import jwt from "jsonwebtoken";
import { uuid } from "uuidv4";

if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET env");
}

db.mongoose
  .connect(
    db.url,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(() => {
    console.log("Connected to the database2!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

const User = db.user;
const Product = db.product;

export const controllers = {
  fallback: (req, res) => {
    return res.status(401).json({ message: "Invalid endpoint or method" });
  },

  ping: (req, res) => {
    return res.status(200).json({ message: "Pong!" });
  },

  signup: async (req, res) => {
    try {
      let { username, password, role } = req.body;
      //console.log("req.body", req.body);
      if (!(username && password && role)) {
        throw new Error("Username or password absent!");
      }
      if (!(role === "buyer" || role === "seller")) {
        throw new Error("Invalid role!");
      }
      let refreshToken = uuid();
      let userId = uuid();
      let data = {
        username,
        password,
        refreshToken,
        userId,
        role
      };
      let user = new User({
        ...data
      });
      await user.save();
      let tokenData = {
        userId,
        role
      };
      let token = jwt.sign(tokenData, JWT_SECRET, { expiresIn: "30m" });
      res.json({
        message: "Successful registration!",
        access_token: token,
        refresh_token: refreshToken
      });
    } catch (e) {
      console.log("signup error", e);
      res.send(`Signup error: ${e.message}`);
    }
  },

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
      let {
        password: db_password,
        role,
        refreshToken,
        userId,
        signedIn
      } = user[0];
      if (signedIn) {
        throw new Error(
          "There is already an active session using your account"
        );
      }
      if (db_password != password) {
        throw new Error("Incorrect password!");
      }
      let tokenData = {
        userId,
        role
      };
      let token = jwt.sign(tokenData, JWT_SECRET, { expiresIn: "30m" });
      res.json({
        message: "Successful authentication!",
        access_token: token,
        refresh_token: refreshToken
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
      let productId = uuid();
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
      let { productName: name } = req.body;
      if (!name) {
        throw new Error("'productName' param not passed!");
      } else {
        name = name.trim();
      }
      let product = await Product.find({
        productName: name
      });
      //console.log("product", product);
      if (!(product.length > 0)) {
        throw new Error("Product not found!");
      }
      let { productName, amountAvailable, cost } = product[0];
      return res.status(200).json({
        data: {
          productName,
          amountAvailable,
          cost
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
      let { productName, amountAvailable, cost, sellerId } = req.body;
      if (!productName) {
        throw new Error("required 'productName' param not passed!");
      } else {
        productName = productName.trim();
      }
      let product = await Product.find({
        productName
      });
      //console.log("product", product);
      if (!(product.length > 0)) {
        throw new Error("Product not found!");
      }
      let { sellerId: db_sellerId } = product[0];

      //step 3. check role & requester is who created
      if (!(userId === db_sellerId && role === "seller")) {
        throw new Error("Either role or sellerId is ineligible!");
      }

      //step 4.update
      let updateData = {};
      if (cost) {
        updateData["cost"] = Number(cost);
      } else if (amountAvailable) {
        updateData["amountAvailable"] = Number(amountAvailable);
      }
      await Product.findOneAndUpdate(
        { productName: productName },
        { ...updateData }
      );
      return res.status(200).json({ message: "Product successfully updated!" });
    } catch (e) {
      console.error("putProduct", e);
      res.send("putProduct error:", e.message);
    }
  },

  deleteProduct: async (req, res) => {
    try {
      //step 1. check if we have userId & role
      let { userId, role } = req.decode;
      if (!(userId && role === "seller")) {
        throw new Error("'userId or role' not validated");
      }

      //step 2. deleteProduct
      let { productName } = req.body;
      if (!productName) {
        throw new Error("required 'productName' param not passed!");
      } else {
        productName = productName.trim();
      }
      let product = await Product.find({
        productName
      });
      if (!(product.length > 0)) {
        throw new Error("Product not found!");
      }

      //check sellerId match
      let { sellerId: db_sellerId } = product[0];
      if (!(userId === db_sellerId && role === "seller")) {
        throw new Error("Either role or sellerId is ineligible!");
      }
      await Product.deleteOne({ productName });
      return res.status(200).json({ message: "Product successfully deleted!" });
    } catch (e) {
      console.error("deleteProduct error", e);
      res.send(`deleteProduct error: ${e.message}`);
    }
  },

  deposit: async (req, res) => {
    try {
      let { coin } = req.body;
      if (!COIN_VALUES.includes(Number(coin))) {
        throw new Error("Provided coin value is ineligible.");
      }
      let { userId, role } = req.decode;
      console.log("userId, role", userId, role);
      if (!(userId && role === "buyer")) {
        throw new Error("'userId or role' not validated");
      }

      //Get currentBalance of Deposit
      let user = await User.find({
        userId
      });
      console.log("user", user[0]);
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

      //Get User to fetch deposit
      let user = await User.find({
        userId
      });
      if (!(user.length > 0)) {
        throw new Error("User not found!");
      }
      //console.log("user", user[0]);
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
      function changeCoins(value) {
        let len = COIN_VALUES.length;
        let change = new Array(len).fill(0);
        let coin, quotient, rem;
        for (let i = len - 1; i > -1; i--) {
          coin = COIN_VALUES[i];
          quotient = Math.floor(value / coin);
          if (quotient > 0) {
            change[i] = quotient;
            value = value % coin;
          }
        }
        return change;
      }
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
      //console.log("reset user", user);
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
  },

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
};
