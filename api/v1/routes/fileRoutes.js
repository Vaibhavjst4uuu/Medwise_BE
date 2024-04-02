const express = require("express");
const router = express.Router();

const filesCtrl = require("../controllers/filesController");




router.post( "/upload", filesCtrl.uploadFile);  //



module.exports = router;