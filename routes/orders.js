const Order = require("../controllers/orders");
const { authMiddleware } = require("../middlewares/middlewares");
const router = require("express").Router();

router.post("/", Order.fetchOrders);
router.post("/create", Order.createOrder);
router.get("/:id", Order.findOrder);
router.patch("/:id", authMiddleware, Order.updateOrder);
router.delete("/:id", authMiddleware, Order.deleteOrder);

module.exports = router;
