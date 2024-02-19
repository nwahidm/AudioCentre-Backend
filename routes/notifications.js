const Notification = require("../controllers/notifications");
const { authMiddleware } = require("../middlewares/middlewares");
const router = require("express").Router();

router.post("/", authMiddleware, Notification.fetchNotifications);

module.exports = router;
