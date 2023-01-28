const { DB_USER, DB_PWD, DB_HOST, DB_PORT, DB_NAME } = process.env;

export default {
  url:
    `mongodb://${DB_USER}:${DB_PWD}@` +
    `${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`
};
