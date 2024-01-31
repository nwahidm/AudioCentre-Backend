const Dashboard = require("../controllers/dashboard");
const { authMiddleware } = require("../middlewares/middlewares");
const router = require("express").Router();

router.get("/recap", authMiddleware, Dashboard.fetchRecapitulation);
router.get("/order", authMiddleware, Dashboard.fetchRecentOrder);
// router.get("/favorite_product", authMiddleware, Dashboard.fetchBestSellingProduct);

module.exports = router;
