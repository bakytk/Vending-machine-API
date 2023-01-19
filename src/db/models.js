//add constraint: cost is multiple of 5's
const DEPOSIT_COIN_VALUES = [5, 10, 20, 50, 100];

export const Product = mongoose => {
  var productSchema = mongoose.Schema({
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
      required: true,
      unique: true
    }
  });
  return mongoose.model("Product", productSchema);
};

//add constraint that role is either "buyer" or "seller"

export const User = mongoose => {
  var userSchema = mongoose.Schema({
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
        validator: function(input) {
          return DEPOSIT_COIN_VALUES.includes(input);
        },
        message: "Deposit should be in multiple of 5"
      }
    },
    role: {
      type: String,
      default: "buyer"
    },
    refreshToken: {
      type: String
    }
  });
  return mongoose.model("User", userSchema);
};
