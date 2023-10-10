const Invoice = require("../controllers/invoices");
const { authMiddleware } = require("../middlewares/middlewares");
const router = require("express").Router();

router.post("/", Invoice.fetchInvoices);
router.post("/create", authMiddleware, Invoice.createInvoice);
router.get("/:id", Invoice.findInvoice);
router.patch("/:id", authMiddleware, Invoice.updateInvoice);
router.delete("/:id", authMiddleware, Invoice.deleteInvoice);

module.exports = router;
