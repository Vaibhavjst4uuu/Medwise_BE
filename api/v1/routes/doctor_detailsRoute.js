const express = require("express");
const router = express.Router();


const doctor_detailCtrl = require("../controllers/doctor_detailsController");

router.post("/register_doctor", doctor_detailCtrl.registerDoctor); // add a new doctor to the system
router.get("/find_all_doctors", doctor_detailCtrl.findAllDoctors);
router.get("/:id", doctor_detailCtrl.findDoctorById);
router.delete("/remove_doctor/:id", doctor_detailCtrl.removeDoctor);  // remove a specific doctor from the database
router.patch("/update_doctor_details/:id", doctor_detailCtrl.updateDoctor);
router.post("/doctor_prefered_locations/:id", doctor_detailCtrl.addDoctorsPreferedLocations);
router.get("/get_Doctors_By_User_Preference/:medPracId/:city/:state", doctor_detailCtrl.getDoctorsByUserPreference);




module.exports = router;