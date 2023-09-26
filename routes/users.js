const User = require("../controllers/users");
const { authMiddleware } = require("../middlewares/middlewares");
const router = require("express").Router();

router.get("/", authMiddleware, User.fetchUsers);
router.get("/:id", authMiddleware, User.findUser);
router.put("/:id", authMiddleware, User.updateUser);
router.delete("/:id", authMiddleware, User.deleteUser);

module.exports = router;