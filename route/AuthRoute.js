const express = require("express");
const passport = require("passport");
const {
  createUser,
  logInUser,
  checkUser,
} = require("../controller/AuthController");

const router = express.Router();
//  /brands is already added in base path
router
  .post("/signup", createUser)
  .post("/login", passport.authenticate("local"), logInUser)
  .get("/check", passport.authenticate("jwt", { session: false }), checkUser);

exports.router = router;
