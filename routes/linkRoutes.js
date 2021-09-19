const express = require("express");
const router = express.Router();
const { createLink, createLinkAsGuest, retrieveLink, addToHits, toggleStatus, setUrlNickname } = require("../controllers/linkController");
const { verifyToken, verifyIsAdmin } = require("../auth");

router.post("/retrieve-link", retrieveLink);
router.post("/create-link", verifyToken, createLink);
router.post("/create-link-as-guest", createLinkAsGuest);
router.put("/add-to-hits", addToHits);
router.put("/set-url-nickname", verifyToken, setUrlNickname);
router.delete("/toggle-status", verifyToken, toggleStatus);

module.exports = router;