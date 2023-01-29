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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
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
function changeCoins(value) {
    var len = COIN_VALUES.length;
    var change = new Array(len).fill(0);
    var coin, quotient, rem;
    for (var i = len - 1; i > -1; i--) {
        coin = COIN_VALUES[i];
        quotient = Math.floor(value / coin);
        if (i === 0) {
            change[0] = value;
        }
        else if (quotient > 0) {
            change[i] = quotient;
            value = value % coin;
        }
    }
    return change;
}
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
        var _a, username, password, role, userId, data, user, tokenData, token, e_1;
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
                    userId = (0, uuidv4_1.uuid)();
                    data = {
                        username: username,
                        password: password,
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
                        userId: userId
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
    }); },
    //if signedIn, throw
    signin: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, username, password, user, _b, db_password, role, userId, deposit, signedIn, tokenData, token, e_2;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 3, , 4]);
                    _a = req.body, username = _a.username, password = _a.password;
                    if (!(username && password)) {
                        throw new Error("Username or password absent!");
                    }
                    return [4 /*yield*/, models_1.User.find({
                            username: username,
                            password: password
                        })];
                case 1:
                    user = _c.sent();
                    //console.log("user", user);
                    if (!(user.length > 0)) {
                        throw new Error("Username not found!");
                    }
                    _b = user[0], db_password = _b.password, role = _b.role, userId = _b.userId, deposit = _b.deposit, signedIn = _b.signedIn;
                    if (signedIn) {
                        throw new Error("There is already an active session using your account");
                    }
                    if (db_password != password) {
                        throw new Error("Incorrect password!");
                    }
                    tokenData = {
                        userId: userId,
                        role: role
                    };
                    token = jsonwebtoken_1["default"].sign(tokenData, JWT_SECRET, { expiresIn: "30m" });
                    return [4 /*yield*/, models_1.User.findOneAndUpdate({ userId: userId }, { signedIn: true })];
                case 2:
                    _c.sent();
                    res.json({
                        message: "Successful authentication!",
                        access_token: token,
                        userId: userId,
                        deposit: deposit
                    });
                    return [3 /*break*/, 4];
                case 3:
                    e_2 = _c.sent();
                    console.log("signin error", e_2);
                    res.send("Signin error: ".concat(e_2.message));
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    createProduct: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, userId, role, user, signedIn, _b, productName, amountAvailable, cost, productId, product, e_3;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 3, , 4]);
                    _a = req.decode, userId = _a.userId, role = _a.role;
                    //console.log("userId, role", userId, role);
                    if (!(userId && role === "seller")) {
                        throw new Error("'userId or role' not validated");
                    }
                    if (role !== "seller") {
                        throw new Error("Action not valid for role");
                    }
                    return [4 /*yield*/, models_1.User.find({
                            userId: userId
                        })];
                case 1:
                    user = _c.sent();
                    if (!(user.length > 0)) {
                        throw new Error("Username not found!");
                    }
                    signedIn = user[0].signedIn;
                    if (!signedIn) {
                        throw new Error("User not signedIn");
                    }
                    _b = req.body, productName = _b.productName, amountAvailable = _b.amountAvailable, cost = _b.cost;
                    if (!(productName && amountAvailable && cost)) {
                        throw new Error("One of 'productName, amountAvailable, cost' params not passed");
                    }
                    productId = (0, uuidv4_1.uuid)();
                    product = new models_1.Product({
                        productId: productId,
                        productName: productName,
                        amountAvailable: Number(amountAvailable),
                        cost: Number(cost),
                        sellerId: userId
                    });
                    console.log("product", product);
                    return [4 /*yield*/, product.save()];
                case 2:
                    _c.sent();
                    return [2 /*return*/, res.json({
                            message: "Product successfully created!",
                            data: { productId: productId }
                        })];
                case 3:
                    e_3 = _c.sent();
                    console.error("createProduct error", e_3);
                    res.send("createProduct error: ".concat(e_3.message));
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    getProduct: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var productId, _a, userId, role, user, signedIn, product, _b, productName, amountAvailable, cost, sellerId, e_4;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 3, , 4]);
                    productId = req.params.id;
                    if (!productId) {
                        throw new Error("'productId' urlParam not passed!");
                    }
                    else {
                        productId = productId.trim();
                    }
                    _a = req.decode, userId = _a.userId, role = _a.role;
                    //console.log("userId, role", userId, role);
                    if (!(userId && role === "seller")) {
                        throw new Error("'userId or role' not validated");
                    }
                    return [4 /*yield*/, models_1.User.find({
                            userId: userId
                        })];
                case 1:
                    user = _c.sent();
                    if (!(user.length > 0)) {
                        throw new Error("Username not found!");
                    }
                    signedIn = user[0].signedIn;
                    if (!signedIn) {
                        throw new Error("User not signedIn");
                    }
                    return [4 /*yield*/, models_1.Product.find({ productId: productId })];
                case 2:
                    product = _c.sent();
                    if (!(product.length > 0)) {
                        throw new Error("Product not found!");
                    }
                    _b = product[0], productName = _b.productName, amountAvailable = _b.amountAvailable, cost = _b.cost, sellerId = _b.sellerId;
                    return [2 /*return*/, res.json({
                            data: {
                                productName: productName,
                                amountAvailable: amountAvailable,
                                cost: cost,
                                sellerId: sellerId
                            }
                        })];
                case 3:
                    e_4 = _c.sent();
                    console.error("getProduct error", e_4);
                    res.send("getProduct error: ".concat(e_4.message));
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    putProduct: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, userId, role, user, signedIn, productId, product, db_sellerId, fields, updateData, fields_1, fields_1_1, item, cost, e_5;
        var e_6, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 4, , 5]);
                    _a = req.decode, userId = _a.userId, role = _a.role;
                    //console.log("userId, role", userId, role);
                    if (!(userId && role === "seller")) {
                        throw new Error("'userId or role' not validated");
                    }
                    return [4 /*yield*/, models_1.User.find({
                            userId: userId
                        })];
                case 1:
                    user = _c.sent();
                    if (!(user.length > 0)) {
                        throw new Error("Username not found!");
                    }
                    signedIn = user[0].signedIn;
                    if (!signedIn) {
                        throw new Error("User not signedIn");
                    }
                    productId = req.params.id;
                    if (!productId) {
                        throw new Error("'productId' urlParam not passed!");
                    }
                    else {
                        productId = productId.trim();
                    }
                    //step 3. check if body not null & seller is authorized
                    if (!req.body) {
                        throw new Error("request body is empty!");
                    }
                    return [4 /*yield*/, models_1.Product.find({ productId: productId })];
                case 2:
                    product = _c.sent();
                    if (!(product.length > 0)) {
                        throw new Error("Product not found!");
                    }
                    db_sellerId = product[0].sellerId;
                    if (!(userId === db_sellerId && role === "seller")) {
                        throw new Error("Either role or sellerId is ineligible!");
                    }
                    fields = [
                        "productName",
                        "amountAvailable",
                        "cost",
                        "sellerId"
                    ];
                    updateData = {};
                    try {
                        for (fields_1 = __values(fields), fields_1_1 = fields_1.next(); !fields_1_1.done; fields_1_1 = fields_1.next()) {
                            item = fields_1_1.value;
                            //console.log("item:", item);
                            if (req.body[item]) {
                                if (item === "cost") {
                                    cost = Number(req.body[item]);
                                    if (cost <= 0 || cost % 5 != 0) {
                                        throw new Error("Cost value must be positive & multiple of 5");
                                    }
                                    updateData[item] = Number(req.body[item]);
                                }
                                else if (item === "amountAvailable") {
                                    updateData[item] = Number(req.body[item]);
                                }
                                else {
                                    updateData[item] = req.body[item];
                                }
                            }
                        }
                    }
                    catch (e_6_1) { e_6 = { error: e_6_1 }; }
                    finally {
                        try {
                            if (fields_1_1 && !fields_1_1.done && (_b = fields_1["return"])) _b.call(fields_1);
                        }
                        finally { if (e_6) throw e_6.error; }
                    }
                    if (Object.keys(updateData).length === 0) {
                        throw new Error("Expected update params not received!");
                    }
                    return [4 /*yield*/, models_1.Product.findOneAndUpdate({ productId: productId }, __assign({}, updateData))];
                case 3:
                    _c.sent();
                    return [2 /*return*/, res.status(200).json({ message: "Product successfully updated!" })];
                case 4:
                    e_5 = _c.sent();
                    console.error("putProduct", e_5);
                    res.send("putProduct error: ".concat(e_5.message));
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); },
    deleteProduct: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, userId, role, user, signedIn, productId, product, db_sellerId, e_7;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 4, , 5]);
                    _a = req.decode, userId = _a.userId, role = _a.role;
                    if (!(userId && role === "seller")) {
                        throw new Error("'userId or role' not validated");
                    }
                    return [4 /*yield*/, models_1.User.find({
                            userId: userId
                        })];
                case 1:
                    user = _b.sent();
                    if (!(user.length > 0)) {
                        throw new Error("Username not found!");
                    }
                    signedIn = user[0].signedIn;
                    if (!signedIn) {
                        throw new Error("User not signedIn");
                    }
                    productId = req.params.id;
                    if (!productId) {
                        throw new Error("'productId' urlParam not passed!");
                    }
                    else {
                        productId = productId.trim();
                    }
                    return [4 /*yield*/, models_1.Product.find({
                            productId: productId
                        })];
                case 2:
                    product = _b.sent();
                    if (!(product.length > 0)) {
                        throw new Error("ProductId not found!");
                    }
                    db_sellerId = product[0].sellerId;
                    if (!(userId === db_sellerId && role === "seller")) {
                        throw new Error("Either role or sellerId is ineligible!");
                    }
                    return [4 /*yield*/, models_1.Product.deleteOne({ productId: productId })];
                case 3:
                    _b.sent();
                    return [2 /*return*/, res.status(200).json({ message: "Product successfully deleted!" })];
                case 4:
                    e_7 = _b.sent();
                    console.error("deleteProduct error", e_7);
                    res.send("deleteProduct error: ".concat(e_7.message));
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); },
    deposit: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var coin, _a, userId, role, user, _b, signedIn, deposit, e_8;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 3, , 4]);
                    coin = req.body.coin;
                    if (!coin) {
                        throw new Error("'coin' value not passed.");
                    }
                    if (!COIN_VALUES.includes(Number(coin))) {
                        throw new Error("Provided coin value is ineligible.");
                    }
                    _a = req.decode, userId = _a.userId, role = _a.role;
                    //console.log("userId, role", userId, role);
                    if (!(userId && role === "buyer")) {
                        throw new Error("'userId or role' not validated");
                    }
                    return [4 /*yield*/, models_1.User.find({
                            userId: userId
                        })];
                case 1:
                    user = _c.sent();
                    if (!(user.length > 0)) {
                        throw new Error("Username not found!");
                    }
                    _b = user[0], signedIn = _b.signedIn, deposit = _b.deposit;
                    if (!signedIn) {
                        throw new Error("User not signedIn");
                    }
                    //update balance
                    deposit += Number(coin);
                    return [4 /*yield*/, models_1.User.findOneAndUpdate({ userId: userId }, { deposit: deposit })];
                case 2:
                    _c.sent();
                    return [2 /*return*/, res.json({
                            message: "Coin successfully deposited!",
                            data: {
                                userId: userId,
                                deposit: deposit
                            }
                        })];
                case 3:
                    e_8 = _c.sent();
                    console.error("deposit error", e_8);
                    res.send("deposit error: ".concat(e_8.message));
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    buy: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, productId, amountProducts, _b, userId, role, user, _c, signedIn, deposit, product, _d, cost, amountAvailable, totalCost, remainder, change, e_9;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 5, , 6]);
                    _a = req.body, productId = _a.productId, amountProducts = _a.amountProducts;
                    if (!(productId && amountProducts)) {
                        throw new Error("'productId or amountProducts' params not passed");
                    }
                    _b = req.decode, userId = _b.userId, role = _b.role;
                    console.log("productId, amountProducts");
                    if (!(userId && role === "buyer")) {
                        throw new Error("'userId or role' not validated");
                    }
                    return [4 /*yield*/, models_1.User.find({
                            userId: userId
                        })];
                case 1:
                    user = _e.sent();
                    if (!(user.length > 0)) {
                        throw new Error("Username not found!");
                    }
                    _c = user[0], signedIn = _c.signedIn, deposit = _c.deposit;
                    if (!signedIn) {
                        throw new Error("User not signedIn");
                    }
                    return [4 /*yield*/, models_1.Product.find({
                            productId: productId
                        })];
                case 2:
                    product = _e.sent();
                    if (!(product.length > 0)) {
                        throw new Error("Product not found!");
                    }
                    _d = product[0], cost = _d.cost, amountAvailable = _d.amountAvailable;
                    if (amountAvailable < Number(amountProducts)) {
                        throw new Error("Insufficient product stock for the purchase.");
                    }
                    totalCost = cost * Number(amountProducts);
                    if (deposit < totalCost) {
                        throw new Error("Insufficient deposit for the purchase.");
                    }
                    remainder = deposit - totalCost;
                    change = changeCoins(remainder);
                    deposit = 0;
                    return [4 /*yield*/, models_1.User.findOneAndUpdate({ userId: userId }, { deposit: deposit })];
                case 3:
                    _e.sent();
                    //debit Product stock
                    amountAvailable -= Number(amountProducts);
                    return [4 /*yield*/, models_1.Product.findOneAndUpdate({ productId: productId }, { amountAvailable: amountAvailable })];
                case 4:
                    _e.sent();
                    return [2 /*return*/, res.json({
                            message: "Purchase is successfully transacted!",
                            data: {
                                productId: productId,
                                totalCost: totalCost,
                                change: change
                            }
                        })];
                case 5:
                    e_9 = _e.sent();
                    console.error("buy error", e_9);
                    res.send("buy error: ".concat(e_9.message));
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); },
    reset: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, userId, role, user, signedIn, deposit, e_10;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    _a = req.decode, userId = _a.userId, role = _a.role;
                    //console.log("userId, role", userId, role);
                    if (!(userId && role === "buyer")) {
                        throw new Error("'userId or role' not validated");
                    }
                    return [4 /*yield*/, models_1.User.find({
                            userId: userId
                        })];
                case 1:
                    user = _b.sent();
                    if (!(user.length > 0)) {
                        throw new Error("Username not found!");
                    }
                    signedIn = user[0].signedIn;
                    if (!signedIn) {
                        throw new Error("User not signedIn");
                    }
                    deposit = 0;
                    return [4 /*yield*/, models_1.User.findOneAndUpdate({ userId: userId }, { deposit: deposit })];
                case 2:
                    _b.sent();
                    return [2 /*return*/, res.json({
                            message: "User deposit reset!"
                        })];
                case 3:
                    e_10 = _b.sent();
                    console.error("deposit error", e_10);
                    res.send("deposit error: ".concat(e_10.message));
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    logout: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var userId, user, e_11;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    userId = req.decode.userId;
                    if (!userId) {
                        throw new Error("'userId' not validated");
                    }
                    return [4 /*yield*/, models_1.User.find({
                            userId: userId
                        })];
                case 1:
                    user = _a.sent();
                    if (!(user.length > 0)) {
                        throw new Error("User not found!");
                    }
                    return [4 /*yield*/, models_1.User.findOneAndUpdate({ userId: userId }, { signedIn: false })];
                case 2:
                    _a.sent();
                    return [2 /*return*/, res.json({
                            message: "User logged out!"
                        })];
                case 3:
                    e_11 = _a.sent();
                    console.error("logout error", e_11);
                    res.send("logout error: ".concat(e_11.message));
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }
};
//# sourceMappingURL=controllers.js.map