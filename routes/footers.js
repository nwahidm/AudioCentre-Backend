const Footer = require("../controllers/footers");
const { authMiddleware } = require("../middlewares/middlewares");
const router = require("express").Router();

router.get("/", Footer.fetchFooters);
router.post("/create", authMiddleware, Footer.createFooter);
router.get("/:id", Footer.findFooter);
router.patch("/:id", authMiddleware, Footer.updateFooter);
router.delete("/:id", authMiddleware, Footer.deleteFooter);

module.exports = router;
