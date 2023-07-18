const express = require("express");
const {
  createOrder,
  fetchOrderByUser,
  deleteOrder,
  updateOrder,
  fetchAllOrders,
} = require("./../controller/OrderController");

const router = express.Router();
//  /brands is already added in base path
router
  .post("/", createOrder)
  .get("/user/userId", fetchOrderByUser)
  .delete("/:id", deleteOrder)
  .patch("/:id", updateOrder)
  .get("/", fetchAllOrders);

exports.router = router;
