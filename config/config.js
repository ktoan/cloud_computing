require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE_NAME,
    host: process.env.DB_HOST,
    dialect: "mysql",
  },
  production: {
    // Add production configuration if needed
  },
};
