const User = require("../controllers/users");
const router = require("express").Router();

router.post("/register", User.register);
router.post("/login", User.login);
router.patch("/activate/:id", User.activate)

module.exports = router;
