const Product = require("../controllers/products");
const { authMiddleware } = require("../middlewares/middlewares");
const router = require("express").Router();

router.post("/create", authMiddleware, Product.create);
router.post("/", Product.fetchProducts);
router.get("/:id", Product.findProduct);
router.patch("/:id", authMiddleware, Product.updateProduct);
router.delete("/:id", authMiddleware, Product.deleteProduct);

module.exports = router;
