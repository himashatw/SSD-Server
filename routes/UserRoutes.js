// ROUTES FOR USER CONTROLLERS
const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const user_jwt = require("../middleware/user_jwt");
const jwt = require("jsonwebtoken");

const {
  checkUserData,
  register,
  login,
} = require("../controllers/UserController");

// user routes
router.get("/", user_jwt, checkUserData);
router.post("/register", register);
router.post("/login", login);

module.exports = router;
