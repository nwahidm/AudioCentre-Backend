const Specification = require("../controllers/specifications");
const { authMiddleware } = require("../middlewares/middlewares");
const router = require("express").Router();

router.post("/", authMiddleware, Specification.fetchSpecifications);
router.post("/create", authMiddleware, Specification.createSpecification);
router.get("/:id", authMiddleware, Specification.findSpecification);
router.patch("/:id", authMiddleware, Specification.updateSpecification);
router.delete("/:id", authMiddleware, Specification.deleteSpecification);

module.exports = router;
