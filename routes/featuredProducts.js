const FeaturedProduct = require("../controllers/featuredProducts");
const { authMiddleware } = require("../middlewares/middlewares");
const router = require("express").Router();

router.post("/create", authMiddleware, FeaturedProduct.create);
router.post("/", FeaturedProduct.fetchFeaturedProducts);
router.get("/:id", FeaturedProduct.findFeaturedProduct);
router.patch("/:id", authMiddleware, FeaturedProduct.updateFeaturedProduct);
router.delete("/:id", authMiddleware, FeaturedProduct.deleteFeaturedProduct);

module.exports = router;
