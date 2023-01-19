const { JWT_SECRET } = process.env;
//const { authSign, AuthError } = require("./auth");
//const { GetMovie } = require("../omdb/rest_api");
import db from "../db/index.js";
import jwt from "jsonwebtoken";
import { uuid } from "uuidv4";

if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET env");
}
//const generateToken = authSign(JWT_SECRET);
//const MOVIE_FIELDS = ["Title", "Released", "Genre", "Director"];

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

/*
  'movies' collection created by default:
    in schema/models.js
*/
// const Movie = db.movies;
// function getFirstDay(year, month) {
//   return new Date(year, month, 1);
// }

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
      console.log("req.body", req.body);
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
        if (!(role === "buyer") || !(role === "seller")) {
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
      console.log("user", user);
      if (!(user.length > 0)) {
        throw new Error("Username not found!");
      }
      //console.log("fetched user", result);
      let { password: db_password, role, refreshToken, userId } = user[0];
      console.log("passwords:", password, db_password);
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

  getProduct: async (req, res) => {
    let { userId, role } = req.decode;
    // let movies = await Movie.find({ UserName: name });
    // let data = [];
    // for (const movie of movies) {
    //   let { Title, Released, Genre, Director } = movie;
    //   let subset = { Title, Released, Genre, Director };
    //   data.push(subset);
    // }
    return res.status(200).json({ data: "data" });
  },

  create: async (req, res) => {
    try {
      let { title: MovieTitle } = req.body;
      if (!MovieTitle) {
        throw new Error("Movie title not passed");
      }

      /*
        Step 1: Check if movie already exists
      */
      let { role: UserRole, name: UserName } = req.decode;
      let movies = await Movie.find({
        UserName: UserName,
        Title: MovieTitle
      });
      if (movies.length > 0) {
        return res.status(200).json({
          message: "Movie is already saved."
        });
      }

      /*
        Step 2: Check if user.role=basic:
        - impose constraint: max 5 movies/month
        - time_window: calendar month (not rolling window)
      */
      if (UserRole === "basic") {
        let date = new Date();
        let firstDay = getFirstDay(date.getFullYear(), date.getMonth());
        movies = await Movie.find({
          UserName: UserName,
          CreatedAt: { $gte: firstDay }
        });
        if (movies.length === 5 || movies.length > 5) {
          return res.status(402).json({
            message: "Basic plan limit exceeded."
          });
        }
      }

      /*
        Step 3: All good:
        => fetch movie data & save
      */
      let response = await GetMovie(MovieTitle);
      if (response.error) {
        //maybe not found!
        throw new Error(response.error);
      }
      let { Title, Released, Genre, Director } = response.data;
      let movie = new Movie({
        Title,
        Released,
        Genre,
        Director,
        UserRole,
        UserName
      });
      await movie.save();
      return res.status(200).json({
        message: "Movie saved successfully."
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: e.message });
    }
  }
};
