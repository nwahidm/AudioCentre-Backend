const Product = require("../controllers/products");
const { authMiddleware } = require("../middlewares/middlewares");
const router = require("express").Router();

router.post("/create", authMiddleware, Product.create);
router.get("/", Product.fetchProducts);
router.get("/:id", Product.findProduct);
router.delete("/:id", authMiddleware, Product.deleteProduct);

module.exports = router;
