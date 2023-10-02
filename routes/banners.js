const Banner = require("../controllers/banners");
const { authMiddleware } = require("../middlewares/middlewares");
const router = require("express").Router();

router.post("/", Banner.fetchBanners);
router.post("/create", authMiddleware, Banner.createBanner);
router.get("/:id", Banner.findBanner);
router.patch("/:id", authMiddleware, Banner.updateBanner);
router.delete("/:id", authMiddleware, Banner.deleteBanner);

module.exports = router;
