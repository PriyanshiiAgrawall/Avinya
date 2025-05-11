
import express from "express";

import { upload } from "../middlewares/uploadMiddleware.js";
import { getPatient, PatientLogin, patientRegistration } from "../Controllers/PatientController.js";

// import { userRegistration, userLogin, fetchAllRegisteredEmails, viewUser, editUser, deleteUser, updatePassword } from "../controllers/User.js";
// import { validateToken } from "../middlewares/apiAuthentication.js"
const router = express.Router();

router.post("/registerPatient", upload.none(), patientRegistration);
router.post("/loginPatient", PatientLogin)
router.get("/getPatient", getPatient)
// router.get("/getTopDoctors", getTopDoctors);
// router.get("/getDoctor", getDoctor)
// router.post(
//     '/registerDoc',
//     upload.fields([
//         { name: 'profilePic', maxCount: 1 },
//         { name: 'certificates', maxCount: 10 }
//     ]),
//     createDoctor
// );
// router.post("/login", userLogin);
// router.get("/fetchAllRegisteredEmails", fetchAllRegisteredEmails);
// router.get("/viewUser", validateToken, viewUser);
// router.post("/editUser", validateToken, editUser);
// router.delete("/deleteUser", validateToken, deleteUser);
// router.post("/updatePassword", validateToken, updatePassword);

export default router;