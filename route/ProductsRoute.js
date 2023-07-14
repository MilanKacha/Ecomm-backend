const express = require("express");
const {
  createProduct,
  fetchAllProduct,
  fetchProductById,
  updateProductById,
} = require("../controller/ProductController");

const router = express.Router();

router
  .post("/", createProduct)
  .get("/", fetchAllProduct)
  .get("/:id", fetchProductById)
  .patch("/:id", updateProductById);

exports.router = router;
