const Dashboard = require("../controllers/dashboard");
const { authMiddleware } = require("../middlewares/middlewares");
const router = require("express").Router();

router.get("/", authMiddleware, Dashboard.fetchAll);
router.get("/recap", authMiddleware, Dashboard.fetchRecapitulation);
router.get("/order", authMiddleware, Dashboard.fetchRecentOrder);

module.exports = router;
