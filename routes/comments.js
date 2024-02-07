const Comment = require("../controllers/comments");
const { authMiddleware } = require("../middlewares/middlewares");
const router = require("express").Router();

router.post("/", authMiddleware, Comment.fetchComments);
router.post("/create", Comment.createComment);
router.get("/:id", authMiddleware, Comment.findComment);
router.patch("/:id", authMiddleware, Comment.updateComment);
router.delete("/:id", authMiddleware, Comment.deleteComment);

module.exports = router;
