const router            = require("express").Router();
const authController    = require("../controllers/auth.controller");

router.post("/register", authController.addUser);
router.post("/login", authController.logUser);
router.post("/reset-password", authController.checkResetPassword);
router.post("/facebooklogin", authController.facebookLogin);
router.post("/googlelogin", authController.googlelogin);
router.put("/reset-password", authController.resetPassword);
router.get("/logout", authController.logoutUser);
router.get("/verify/:uniqueString", authController.verifyEmail);
router.get("/loggedIn", authController.isLoggedIn);
router.get("/:email", authController.checkEmail);

module.exports = router;