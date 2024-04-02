const express = require("express");
const router = express.Router();
const { checkreqBody, checkreqParams } = require("../middleware/formvalidator");


const userCtrl = require("../controllers/userController");

router.get("/all_users", userCtrl.findAllUsers);
router.post("/add_user_consulted_doctors", userCtrl.addUserConsultedDoctors);
router.post("/assign_role", userCtrl.assignRole);

router.get("/user_specific_role/:id",checkreqParams, userCtrl.userSpecificRole);
router.get("/:id", userCtrl.findUserById);
router.patch("/update_user/:id", userCtrl.updateUser);
router.delete("/remove_user/:id", userCtrl.deleteUser);
router.get(
  "/get_user_consulted_doctor/:user_id",
  userCtrl.getUserConsultedDoctors
);
router.post("/profile_pic/:id", userCtrl.addOrChangeProfile_pic);


module.exports = router;
