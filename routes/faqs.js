const FAQ = require("../controllers/faqs");
const { authMiddleware } = require("../middlewares/middlewares");
const router = require("express").Router();

router.post("/", FAQ.fetchFAQs);
router.post("/create", authMiddleware, FAQ.createFAQ);
router.get("/:id", FAQ.findFAQ);
router.patch("/:id", authMiddleware, FAQ.updateFAQ);
router.delete("/:id", authMiddleware, FAQ.deleteFAQ);

module.exports = router;
