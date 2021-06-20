const router            = require("express").Router();
const authController    = require("../controllers/auth.controller");

router.post("/register", authController.addUser);
router.post("/login", authController.logUser);
router.get("/logout", authController.logoutUser);
router.get("/verify/:uniqueString", authController.verifyEmail);
router.get("/:email", authController.checkEmail);
// verify token for frontend
router.get("/loggedIn", authController.isLoggedIn)

module.exports = router;