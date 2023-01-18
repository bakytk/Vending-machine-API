const { JWT_SECRET } = process.env;
//const { authSign, AuthError } = require("./auth");
//const { GetMovie } = require("../omdb/rest_api");
import db from "../db/index.js";

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
    console.log("Connected to the database!");
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

export const controllers = {
  fallback: (req, res) => {
    return res.status(401).json({ message: "Invalid endpoint or method" });
  },
  ping: (req, res) => {
    return res.status(200).json({ message: "Pong!" });
  },

  authenticate: (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Invalid payload" });
    }
    try {
      const token = generateToken(username, password);
      return res.status(200).json({ token });
    } catch (error) {
      if (error instanceof AuthError) {
        return res.status(401).json({ error: error.message });
      }
      next(error);
    }
  },

  fetch: async (req, res) => {
    let { name } = req.decode;
    let movies = await Movie.find({ UserName: name });
    let data = [];
    for (const movie of movies) {
      let { Title, Released, Genre, Director } = movie;
      let subset = { Title, Released, Genre, Director };
      data.push(subset);
    }
    return res.status(200).json({ data: data });
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
      return res.status(500).json({ message: "Processing error." });
    }
  }
};
