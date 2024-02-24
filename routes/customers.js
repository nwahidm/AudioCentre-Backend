const Customer = require("../controllers/customers");
const { authMiddleware } = require("../middlewares/middlewares");
const router = require("express").Router();

router.post("/", authMiddleware, Customer.fetchCustomers);
router.post("/create", authMiddleware, Customer.createCustomer);
router.get("/:id", authMiddleware, Customer.findCustomer);
router.patch("/:id", authMiddleware, Customer.updateCustomer);
router.delete("/:id", authMiddleware, Customer.deleteCustomer);

module.exports = router;
