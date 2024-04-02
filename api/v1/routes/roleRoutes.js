const express = require("express");
const router = express.Router();

const roleCtrl = require("../controllers/roleController");

router.post("/add_role", roleCtrl.addRole);

router.delete("/remove_role/:id", roleCtrl.delRole);

router.get("/get_all_roles", roleCtrl.getAllRoles);

router.get("/get_specific_role/:id", roleCtrl.getSpecificRole);

router.patch("/update_role/:id", roleCtrl.updateRole);






module.exports = router;