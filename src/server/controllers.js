const { JWT_SECRET } = process.env;
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
      if (!(username && password)) {
        throw new Error("Username or password absent!");
      }
      let refreshToken = uuid();
      let userId = uuid();
      let data = {
        username,
        password,
        refreshToken,
        userId
      };
      if (role) {
        if (!(role === "buyer" || role === "seller")) {
          throw new Error("Invalid role!");
        }
        data["role"] = role;
      }
      let user = new User({
        ...data
      });
      await user.save();
      let tokenData = {
        userId,
        role
      };
      let token = jwt.sign(tokenData, JWT_SECRET, { expiresIn: "10m" });
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
      let { password: db_password, role, refreshToken, userId } = user[0];
      if (db_password != password) {
        throw new Error("Incorrect password!");
      }
      let tokenData = {
        userId,
        role
      };
      let token = jwt.sign(tokenData, JWT_SECRET, { expiresIn: "10m" });
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
    let { userId, role } = req.decode;
    console.log("userId, role", userId, role);
    if (!(userId && role)) {
      throw new Error("'userId or role' not available in token");
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
    let product = new Product({
      productName,
      amountAvailable: Number(amountAvailable),
      cost: Number(cost),
      sellerId: userId
    });
    await product.save();
    return res.status(200).json({ message: "Product successfully created!" });
  },

  getProduct: async (req, res) => {
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
  },

  putProduct: async (req, res) => {
    try {
      //step 1. check if we have userId & role
      let { userId, role } = req.decode;
      //console.log("userId, role", userId, role);
      if (!(userId && role)) {
        throw new Error("'userId or role' not available in token");
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
      throw new Error("putProduct error:", e.message);
    }
  },

  deleteProduct: async (req, res) => {
    try {
      //step 1. check if we have userId & role
      let { userId, role } = req.decode;
      if (!(userId && role)) {
        throw new Error("'userId or role' not available in token");
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
      throw new Error(`deleteProduct error: ${e.message}`);
    }
  }
};
