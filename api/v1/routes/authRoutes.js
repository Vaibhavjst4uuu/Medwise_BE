const express = require("express");
const router = express.Router();
const authCtrl = require("../controllers/authController");
const { authenticateToken } = require("../middleware/verifytoken");
const { checkreqBody, checkreqParams } = require("../middleware/formvalidator");
const { trimRequestBody } = require("../middleware/trimData");
let  middleware2 = [trimRequestBody, checkreqBody] ;



router.post("/signup", middleware2, authCtrl.signup); // Sign up
router.post("/admin_login", middleware2, authCtrl.AdminLogIn);  // Admin and Super Admin Log in
router.post("/login", middleware2, authCtrl.login); //for user login
router.patch('/forget_password', middleware2, authCtrl.forget_password); // log out the user
router.post("/verify_resetToken", middleware2, authCtrl.verifyresetToken);
router.post("/reset_password",  middleware2, authCtrl.resetPassword) ;

router.post("/logout",authCtrl.logOut);   // Log Out
router.post("/log_out_from_all_devices",authenticateToken, authCtrl.logOutFromAll); // Log Out from all devices







module.exports = router
