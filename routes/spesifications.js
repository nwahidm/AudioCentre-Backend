const Spesification = require("../controllers/spesifications");
const { authMiddleware } = require("../middlewares/middlewares");
const router = require("express").Router();

router.post("/", authMiddleware, Spesification.fetchSpesifications);
router.post("/create", authMiddleware, Spesification.createSpesification);
router.get("/:id", authMiddleware, Spesification.findSpesification);
router.patch("/:id", authMiddleware, Spesification.updateSpesification);
router.delete("/:id", authMiddleware, Spesification.deleteSpesification);

module.exports = router;
