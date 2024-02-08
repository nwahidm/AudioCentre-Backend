const Pengembalian = require("../controllers/pengembalians");
const { authMiddleware } = require("../middlewares/middlewares");
const router = require("express").Router();

router.post("/", Pengembalian.fetchPengembalians);
router.post("/create", authMiddleware, Pengembalian.createPengembalian);
router.get("/:id", Pengembalian.findPengembalian);
router.patch("/:id", authMiddleware, Pengembalian.updatePengembalian);
router.delete("/:id", authMiddleware, Pengembalian.deletePengembalian);

module.exports = router;
