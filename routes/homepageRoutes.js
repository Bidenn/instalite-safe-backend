const express = require("express");
const router = express.Router();
const { getHomepageData } = require("../controllers/homepageController");
const { authenticateJWT } = require("../middlewares/authenticateJWT");

router.get("/", authenticateJWT, getHomepageData);

module.exports = router;
