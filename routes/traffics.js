const Traffic = require("../controllers/traffics");
const router = require("express").Router();

router.post("/", Traffic.fetchTraffics);
router.post("/create", Traffic.createTraffic);
router.get("/:id", Traffic.findTraffic);
router.delete("/:id", Traffic.deleteTraffic);

module.exports = router;
