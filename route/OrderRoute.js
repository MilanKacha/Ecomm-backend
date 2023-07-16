const express = require("express");
const {
  createOrder,
  fetchOrderByUser,
  deleteOrder,
  updateOrder,
} = require("./../controller/OrderController");

const router = express.Router();
//  /brands is already added in base path
router
  .post("/", createOrder)
  .get("/", fetchOrderByUser)
  .delete("/:id", deleteOrder)
  .patch("/:id", updateOrder);

exports.router = router;
