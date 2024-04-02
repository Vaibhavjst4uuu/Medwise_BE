const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/verifytoken");
const { checkreqBody, checkreqParams } = require("../middleware/formvalidator");
const { trimRequestBody } = require("../middleware/trimData");

// let middleware1 = [checkreqBody, checkreqParams];
let  middleware2 = [trimRequestBody, checkreqBody] ;

// Require controller modules.
const authRoutes = require("./authRoutes");
const medical_practiceRoutes = require("./medPracticeRoute");
const rolesRoutes = require("./roleRoutes");
const  usersRoutes = require("./userRoutes");
const doctorRoutes = require( "./doctor_detailsRoute") ;
const chatRoutes = require("./chat_logRoutes");
const filesRoutes = require("./fileRoutes");

 

router.use("/auth", authRoutes);
router.use("/medical-practices", medical_practiceRoutes);
router.use("/roles",authenticateToken, rolesRoutes);
router.use("/users",authenticateToken, usersRoutes);
router.use("/doctors",authenticateToken, doctorRoutes);
router.use("/chat_logs", authenticateToken, chatRoutes);
router.use("/files", filesRoutes);








module.exports = router