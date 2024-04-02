const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/verifytoken");


const medPracticeCtrl = require("../controllers/medical_practiceController");

router.post("/add_medical_practice",authenticateToken, medPracticeCtrl.addMedPrac);

router.delete("/remove_medical_practice/:id",authenticateToken, medPracticeCtrl.delMedPrac);

router.get("/get_all_med_practices", medPracticeCtrl.getAllMedPracs);

router.get("/get_specific_med_practices/:id",authenticateToken, medPracticeCtrl.getSpecificMedPrac);

router.patch("/update_med_practices/:id",authenticateToken, medPracticeCtrl.updateMedPrac);






module.exports = router;