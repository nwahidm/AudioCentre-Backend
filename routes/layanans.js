const Layanan = require("../controllers/layanans");
const { authMiddleware } = require("../middlewares/middlewares");
const router = require("express").Router();

router.post("/", Layanan.fetchLayanans);
router.post("/create", authMiddleware, Layanan.createLayanan);
router.get("/:id", Layanan.findLayanan);
router.patch("/:id", authMiddleware, Layanan.updateLayanan);
router.delete("/:id", authMiddleware, Layanan.deleteLayanan);

module.exports = router;
