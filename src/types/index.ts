import { Document } from "mongoose";

export interface IUser extends Document {
  userId: string;
  username: string;
  password: string;
  deposit: number;
  role: string;
  signedIn: bool;
  refreshToken: string;
}

export interface IProduct extends Document {
  productId: string;
  amountAvailable: number;
  cost: number;
  productName: string;
  sellerId: string;
}

export interface TokenData {
  userId: string;
  role: string;
}
