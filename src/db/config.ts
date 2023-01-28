const DB_USER: string = process.env.DB_USER;
const DB_PWD: string = process.env.DB_PWD;
const DB_HOST: string = process.env.DB_HOST;
const DB_PORT: string = process.env.DB_PORT;
const DB_NAME: string = process.env.DB_NAME;

export const DB_URL: string =
  `mongodb://${DB_USER}:${DB_PWD}@` +
  `${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`;
