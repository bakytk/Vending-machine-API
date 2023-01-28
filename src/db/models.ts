import { IUser, IProduct } from "../types/index";
import { model, Schema, Model } from "mongoose";

const UserSchema: Schema = new Schema<IUser>({
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
    // validate: {
    //   validator: function(input) {
    //     return typeof input === "number";
    //   },
    //   message: "Deposit must be a number"
    // },
    default: 0
  },
  role: {
    type: String,
    default: "buyer"
  },
  signedIn: {
    type: Boolean,
    default: false
  },
  refreshToken: {
    type: String
  }
});

export const User: Model<IUser> = model("User", UserSchema);

export const Product = mongoose => {
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
        validator: function(input) {
          return typeof input === "number";
        },
        message: "amountAvailable must be a number"
      }
    },
    cost: {
      type: Number,
      required: true,
      validate: {
        validator: function(input) {
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
