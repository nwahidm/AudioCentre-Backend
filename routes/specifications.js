const Specification = require("../controllers/specifications");
const { authMiddleware } = require("../middlewares/middlewares");
const router = require("express").Router();

router.post("/", authMiddleware, Specification.fetchspecifications);
router.post("/create", authMiddleware, Specification.createspecification);
router.get("/:id", authMiddleware, Specification.findspecification);
router.patch("/:id", authMiddleware, Specification.updatespecification);
router.delete("/:id", authMiddleware, Specification.deletespecification);

module.exports = router;
