const express = require("express");
const { fetchUserById, updateUser } = require("../controller/UserController");

const router = express.Router();
//  /brands is already added in base path
router.get("/:id", fetchUserById).patch("/:id", updateUser);

exports.router = router;
