const express = require("express");
const router = express.Router();
const { register , login, profile, saveStoredLinks } = require("../controllers/userController");
const { verifyToken, verifyIsAdmin } = require("../auth");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", verifyToken, profile);
router.put("/save-stored-links", saveStoredLinks);

module.exports = router;