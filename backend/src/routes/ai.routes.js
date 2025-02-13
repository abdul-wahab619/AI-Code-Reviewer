const express = require("express");
const aiController = require("../controllers/ai.controller");
const { authMiddleware } = require("../controllers/auth.controller");
const router = express.Router();

router.post("/get-review", aiController.getReview);
router.get("/past-prompts", aiController.getPastPrompts);
router.put("/past-prompts/:id", aiController.updateReview);
router.delete("/past-prompts/:id", aiController.deleteReview);

module.exports = router;
