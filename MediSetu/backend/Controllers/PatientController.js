import { generateToken } from "../middlewares/apiAuthentication.js";
import Patient from "../Models/Patient.js";
import { z } from 'zod';
import bcrypt from "bcrypt"


const userRegistrationInput = z.object({
    fullName: z.string().nonempty("Full name is required"),
    emailId: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});


export const patientRegistration = async (req, res) => {
    try {
        console.log("hello");
        const validatedData = req.body;
        console.log(validatedData)

        //If the input (req.body) does not match the userRegistrationInput, Zod will automatically throw an error we do not manually return respose
        // Check if the email already exists in the database

        const existingUser = await Patient.findOne({ email: validatedData.email });
        console.log(existingUser)
        if (existingUser) {
            return res.status(403).json({
                success: false,
                message: "Patient already exists",
            });
        }
        // Hash the password using bcrypt and setting it in place of original password
        //salt - A random string added to a password before hashing to make the hash unique, Even if two users have the same password, the salt ensures their hashes are different, making it harder for attackers to guess passwords.
        const salt = await bcrypt.genSalt(10);
        validatedData.password = await bcrypt.hash(validatedData.password, salt);

        // Create a new user in the database
        const newUser = await Patient.create({
            name: validatedData.fullName,
            email: validatedData.email,
            password: validatedData.password
        });

        // Respond with success
        return res.status(200).json({
            success: true,
            message: "User Registration Successful,now login to continue",
            userId: newUser._id,
        });
        //id is send as response for further calls ex- updating user,fetching user groups etc

    } catch (err) {


        res.status(err.status || 500).json({
            success: false,
            message: err.message,
        });
    }
};



export const PatientLogin = async (req, res) => {
    try {
        console.log("hello")
        //zod validation for inputted fields
        const validatedData = req.body;
        //extract what is coming in request
        const { emailId, password } = validatedData;
        //check if email exist in db
        const user = await Patient.findOne({
            emailId: emailId
        })
        //if user doen't exists

        if (!user) {
            return res.status(403).json({
                message: "You Have Not Yet Registered Please Register then proceed to Login"
            })
        }
        //if user does exist 
        //validate password inputted 
        const passMatches = await bcrypt.compare(password, user.password)

        //if password doesnt match
        if (!passMatches) {
            return res.status(401).json({
                message: "You have inputted wong password, Try Again!"
            })

        }
        //password matches now generate token
        const payload = {
            id: user._id,
            emailId: emailId,
            role: "patient"

        }
        const token = generateToken(payload);

        //putting token in the user object which we just fetched from the db 
        user.token = token;
        //password is set to undefined to avoid sending it back in the response, ensuring sensitive data is not exposed.
        user.password = undefined;
        //putting this token in authorisation header
        res.setHeader("Authorization", `Bearer ${token}`);

        //now creating cookie to send token in each subsequent request 
        const options = {
            expiresIn: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };
        return res.cookie("token", token, options).status(200).json({
            message: "Successfully Logged In",
            success: true,
            //we defined all fields of user here so that password doesnt go in response by mistake
            user: user,
            accessToken: token,
        })

    }
    catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({
            message: "Logging in failed",
            success: false,

        })
    }

}

export const getPatient = async (req, res) => {
    try {
        const { patientId } = req.query;

        if (!patientId) {
            return res.status(400).json({ message: 'Patient ID is required' });
        }

        const patient = await Patient.findById(patientId)
            .populate({
                path: 'appointments',
                populate: {
                    path: 'doctor',
                    select: 'fullName specialization profilePic email phoneNumber'
                }
            });

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        // Convert the patient object to a plain JavaScript object
        const patientObj = patient.toObject();

        // Log the populated data for debugging
        console.log('Populated patient data:', JSON.stringify(patientObj, null, 2));

        res.status(200).json({ patient: patientObj });
    } catch (error) {
        console.error('Error fetching patient:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};





