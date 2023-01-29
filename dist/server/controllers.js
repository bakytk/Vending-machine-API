"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.controllers = void 0;
var JWT_SECRET = process.env.JWT_SECRET || "";
var COIN_VALUES = [5, 10, 20, 50, 100];
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var uuidv4_1 = require("uuidv4");
if (!JWT_SECRET) {
    throw new Error("Missing JWT_SECRET env");
}
var connect_1 = __importDefault(require("../db/connect"));
var models_1 = require("../db/models");
var config_1 = require("../db/config");
(0, connect_1["default"])({ DB_URL: config_1.DB_URL });
exports.controllers = {
    fallback: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, res.status(401).json({ message: "Invalid endpoint or method" })];
        });
    }); },
    ping: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, res.status(200).json({ message: "Pong!" })];
        });
    }); },
    signup: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, username, password, role, refreshToken, userId, data, user, tokenData, token, e_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    _a = req.body, username = _a.username, password = _a.password, role = _a.role;
                    //console.log("req.body", req.body);
                    if (!(username && password && role)) {
                        throw new Error("Either of 'username-password-role' is absent!");
                    }
                    if (!(role === "buyer" || role === "seller")) {
                        throw new Error("Invalid role!");
                    }
                    refreshToken = (0, uuidv4_1.uuid)();
                    userId = (0, uuidv4_1.uuid)();
                    data = {
                        username: username,
                        password: password,
                        refreshToken: refreshToken,
                        userId: userId,
                        role: role
                    };
                    user = new models_1.User(__assign({}, data));
                    return [4 /*yield*/, user.save()];
                case 1:
                    _b.sent();
                    tokenData = {
                        userId: userId,
                        role: role
                    };
                    token = jsonwebtoken_1["default"].sign(tokenData, JWT_SECRET, { expiresIn: "30m" });
                    res.json({
                        message: "Successful registration!",
                        access_token: token,
                        refresh_token: refreshToken
                    });
                    return [3 /*break*/, 3];
                case 2:
                    e_1 = _b.sent();
                    console.log("signup error", e_1);
                    res.send("Signup error");
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); }
    /*
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
    */
};
//# sourceMappingURL=controllers.js.map