const express = require("express");
const { Op } = require("sequelize");
const Product = require("../models/product");
const upload = require("../upload/upload");
const cloudinary = require("../cloudinary/cloudinary");

const ITEMS_PER_PAGE = 3;

const router = express.Router();

router.get("/products", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * ITEMS_PER_PAGE;

    const keyword = req.query.keyword || "";

    const searchCondition = {
      name: {
        [Op.like]: `%${keyword}%`,
      },
    };

    const { count, rows: products } = await Product.findAndCountAll({
      where: searchCondition,
      limit: ITEMS_PER_PAGE,
      offset: offset,
      order: [["id", "DESC"]],
    });

    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);

    res.json({
      products,
      currentPage: page,
      totalPages,
      keyword: keyword,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/products", upload.single("image"), async (req, res) => {
  try {
    const { name, brief, price, quantity } = req.body;

    let errorMessage;
    let isPermitted = true;
    let imageName;

    if (!name || !brief || !price || !quantity || req.file === undefined) {
      errorMessage = "All fields must be filled!";
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
      res.json({ success: true, message: "Product created successfully." });
    } else {
      res.status(400).json({ success: false, message: errorMessage });
    }
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
