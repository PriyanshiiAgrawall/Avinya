import express from "express";
import { createDoctor, DoctorLogin, filterDoctors, getDoctor, getTopDoctors, getUnverifiedDoctors, verifyDoctor } from "../Controllers/DoctorController.js";
import { upload } from "../middlewares/uploadMiddleware.js";

// import { userRegistration, userLogin, fetchAllRegisteredEmails, viewUser, editUser, deleteUser, updatePassword } from "../controllers/User.js";
// import { validateToken } from "../middlewares/apiAuthentication.js"
const router = express.Router();

router.get("/filterDoctors", filterDoctors);
router.get("/getTopDoctors", getTopDoctors);
router.get("/getDoctor", getDoctor)
router.post(
    '/registerDoc',
    upload.fields([
        { name: 'profilePic', maxCount: 1 },
        { name: 'certificates', maxCount: 10 }
    ]),
    createDoctor
);
router.post("/loginDoctor", DoctorLogin)

router.get("/unverified-doctors", getUnverifiedDoctors);
router.post("/verify", verifyDoctor);
// router.post("/login", userLogin);
// router.get("/fetchAllRegisteredEmails", fetchAllRegisteredEmails);
// router.get("/viewUser", validateToken, viewUser);
// router.post("/editUser", validateToken, editUser);
// router.delete("/deleteUser", validateToken, deleteUser);
// router.post("/updatePassword", validateToken, updatePassword);

export default router;