"use strict";
exports.__esModule = true;
exports.Product = exports.User = void 0;
var mongoose_1 = require("mongoose");
var UserSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    deposit: {
        type: Number,
        validate: {
            validator: function (input) {
                return typeof input === "number";
            },
            message: "Deposit must be a number"
        },
        "default": 0
    },
    role: {
        type: String,
        "default": "buyer"
    },
    signedIn: {
        type: Boolean,
        "default": false
    },
    refreshToken: {
        type: String
    }
});
//Model<IUser>
exports.User = (0, mongoose_1.model)("User", UserSchema);
var Product = function (mongoose) {
    var productSchema = mongoose.Schema({
        productId: {
            type: String,
            required: true,
            unique: true
        },
        amountAvailable: {
            type: Number,
            required: true,
            validate: {
                validator: function (input) {
                    return typeof input === "number";
                },
                message: "amountAvailable must be a number"
            }
        },
        cost: {
            type: Number,
            required: true,
            validate: {
                validator: function (input) {
                    return input % 5 === 0 && input > 0;
                },
                message: "Deposit should be in multiple of 5"
            }
        },
        productName: {
            type: String,
            required: true,
            unique: true
        },
        sellerId: {
            type: String,
            required: true
        }
    });
    return mongoose.model("Product", productSchema);
};
exports.Product = Product;
//# sourceMappingURL=models.js.map