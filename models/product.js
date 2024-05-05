// models/user.js
const { DataTypes } = require("sequelize");
const sequelize = require("../database/db"); // Assuming your connection file is named db.js

const Product = sequelize.define("products", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  brief: {
    type: DataTypes.STRING,
  },
  image: {
    type: DataTypes.STRING,
  },
  price: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
  },
  isApproved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // Set a default value for the new attribute
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
});

module.exports = Product;
