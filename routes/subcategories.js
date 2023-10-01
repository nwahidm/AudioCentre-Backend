const Subcategory = require("../controllers/subcategories");
const { authMiddleware } = require("../middlewares/middlewares");
const router = require("express").Router();

router.post("/", Subcategory.fetchSubcategories);
router.post("/create", authMiddleware, Subcategory.createSubcategory);
router.get("/:id", Subcategory.findSubcategory);
router.patch("/:id", authMiddleware, Subcategory.updateSubcategory);
router.delete("/:id", authMiddleware, Subcategory.deleteSubcategory);

module.exports = router;
