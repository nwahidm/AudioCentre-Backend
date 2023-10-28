const Category = require("../controllers/categories");
const { authMiddleware } = require("../middlewares/middlewares");
const router = require("express").Router();

router.post("/", Category.fetchCategories);
router.post("/cms", authMiddleware, Category.fetchCategoriesCMS);
router.post("/create", authMiddleware, Category.createCategory);
router.get("/:id", Category.findCategory);
router.patch("/:id", authMiddleware, Category.updateCategory);
router.delete("/:id", authMiddleware, Category.deleteCategory);

module.exports = router;
