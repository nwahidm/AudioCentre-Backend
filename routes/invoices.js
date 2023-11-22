const Invoice = require("../controllers/invoices");
const { authMiddleware } = require("../middlewares/middlewares");
const router = require("express").Router();

router.post("/", authMiddleware, Invoice.fetchInvoices);
router.post("/create", Invoice.createInvoice);
router.get("/:id", authMiddleware, Invoice.findInvoice);
router.patch("/:id", authMiddleware, Invoice.updateInvoice);
router.delete("/:id", authMiddleware, Invoice.deleteInvoice);

module.exports = router;
