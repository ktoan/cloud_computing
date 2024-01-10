// index.js
const express = require("express");
const productController = require("./controllers/productController");
const apiController = require("./controllers/apiController");
const flash = require("express-flash");
const session = require("express-session");
const app = express();
const port = 3000;

// Set EJS as the view engine
app.set("view engine", "ejs");

// Serve static files from the 'public' directory
app.use(express.static("public"));
app.use(
  session({
    secret: "CloudComputingFinalProject", // Change this to a secure random string
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());
// Define routes
app.use("/", productController);
app.use("/api/v1", apiController);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
