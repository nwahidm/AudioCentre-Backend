const Brand = require("../controllers/brands");
const { authMiddleware } = require("../middlewares/middlewares");
const router = require("express").Router();

router.post("/", Brand.fetchBrands);
router.post("/create", authMiddleware, Brand.createBrand);
router.get("/:id", Brand.findBrand);
router.patch("/:id", authMiddleware, Brand.updateBrand);
router.delete("/:id", authMiddleware, Brand.deleteBrand);

module.exports = router;
