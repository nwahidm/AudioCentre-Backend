const Kewenangan = require("../controllers/kewenangans");
const { authMiddleware } = require("../middlewares/middlewares");
const router = require("express").Router();

router.get("/", authMiddleware, Kewenangan.fetchKewenangans);
router.post("/create", authMiddleware, Kewenangan.createKewenangan);
router.get("/:id", authMiddleware, Kewenangan.findKewenangan);
router.patch("/:id", authMiddleware, Kewenangan.updateKewenangan);
router.delete("/:id", authMiddleware, Kewenangan.deleteKewenangan);

module.exports = router;
