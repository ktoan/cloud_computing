const { Op } = require("sequelize");
const Product = require("../models/product");
const upload = require("../upload/upload");
const express = require("express");
const router = express.Router();
const cloudinary = require("../cloudinary/cloudinary");

const ITEMS_PER_PAGE = 3;

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * ITEMS_PER_PAGE;
  
    // Extract keyword from query parameters
    const keyword = req.query.keyword || "";
  
    // Define the SQL query
    const sqlQuery = `
      SELECT *
      FROM products
      WHERE name LIKE '%${keyword}%'
      AND isApproved = true
      ORDER BY id DESC
      LIMIT ${ITEMS_PER_PAGE}
      OFFSET ${offset};
    `;
  
    // Execute the SQL query
    const products = await sequelize.query(sqlQuery, { type: sequelize.QueryTypes.SELECT });
  
    // Count total products (you can also count using another query)
    const count = products.length;
  
    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
  
    res.render("index", {
      products,
      currentPage: page,
      totalPages,
      keyword: keyword, // Pass the keyword back to the view for displaying in the search input
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/create", (req, res) => {
  res.render("create", { errorMessage: "" });
});

router.post("/create", upload.single("image"), async (req, res) => {
  try {
    const { name, brief, price, quantity } = req.body;

    let errorMessage;
    let isPermitted = true;
    let imageName;

    if (!name || !brief || !price || !quantity || req.file === undefined) {
      errorMessage = "All field must be filled!";
      isPermitted = false;
    }

    if (req.file !== undefined) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageName = result.secure_url;
    }

    if (isPermitted) {
      await Product.create({
        name,
        brief,
        image: imageName,
        price,
        quantity,
      });
      res.redirect("/");
    } else {
      res.render("create", { errorMessage });
    }
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
