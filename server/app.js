// Import required modules
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
require("dotenv").config(); // Load environment variables
const helmet = require("helmet");
require("express-async-errors"); // Handle async errors in Express
const { errorMiddleware } = require("./middlewares/error.js");

// Create an Express application
const app = express();

// Get MySQL connection string from environment variables
const sqlhost = process.env.SQL_HOST;
const sqluser = process.env.SQL_USER;
const sqlpassword = process.env.SQL_PASSWORD;
const sqldb = process.env.SQL_DATABASE;

// Connect to MySQL
const connection = mysql.createConnection({
  host: sqlhost,
  user: sqluser,
  password: sqlpassword,
  database: sqldb,
});

connection.connect((err) => {
  if (err) {
    console.error("Erreur during connection to the database :", err.message);
    return;
  }
  console.log("Connected to MySQL database");
});

// Middleware setup
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(helmet()); // Set security HTTP headers
app.use(errorMiddleware); // Custom error handling middleware

// Import and use application routes
const routes = require("./router/index.js");
app.use("/", routes);

// Export the configured Express application
module.exports = app;
