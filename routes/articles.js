const Article = require("../controllers/articles");
const { authMiddleware } = require("../middlewares/middlewares");
const router = require("express").Router();

router.post("/", Article.fetchArticles);
router.post("/create", authMiddleware, Article.createArticle);
router.get("/:id", Article.findArticle);
router.patch("/:id", authMiddleware, Article.updateArticle);
router.delete("/:id", authMiddleware, Article.deleteArticle);

module.exports = router;
