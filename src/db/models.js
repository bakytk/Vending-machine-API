//add constraint: cost is multiple of 5's
export const Product = mongoose => {
  var productSchema = mongoose.Schema({
    amountAvailable: {
      type: Number,
      required: true
    },
    cost: {
      type: Number,
      required: true
    },
    productName: {
      type: String,
      required: true
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
      default: 0
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
