import Doctor from '../Models/Doctor.js';
import bcrypt from 'bcrypt';
import { uploadDoctorCertifications, uploadProfilePic } from '../lib/cloudinary.js';


export const createDoctor = async (req, res) => {
    try {
        const {
            fullName,
            email,
            password,
            phoneNumber,
            specialization,
            yearsOfExperience,
            address,
            currentWorking,
            city,
            consultationFee,
            availableSlots,
            about,
            qualification
        } = req.body;

        const existingDoctor = await Doctor.findOne({ email });
        if (existingDoctor) {
            return res.status(400).json({ message: 'Doctor already registered with this email' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newDoctor = new Doctor({
            fullName,
            email,
            password: hashedPassword,
            phoneNumber,
            specialization,
            yearsOfExperience,
            address,
            currentWorking,
            city,
            consultationFee,
            availableSlots: JSON.parse(availableSlots),
            certificates: [],
            isVerified: false,
            about,
            qualification
        });

        await newDoctor.save();

        // Upload profile pic if exists
        if (req.files?.profilePic && req.files.profilePic[0]) {
            const profileBuffer = req.files.profilePic[0].buffer;
            const profilePicUrl = await uploadProfilePic(profileBuffer, newDoctor._id);
            newDoctor.profilePic = profilePicUrl;
        }

        // Upload certificates
        if (req.files?.certificates?.length > 0) {
            const certificateFiles = req.files.certificates;
            const certificateUrls = await uploadDoctorCertifications(certificateFiles, newDoctor._id);
            newDoctor.certificates = certificateUrls;
        }

        await newDoctor.save();

        res.status(201).json({
            message: 'Doctor created successfully and sent for verification',
            doctorId: newDoctor._id
        });
    } catch (error) {
        console.error('Error creating doctor:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};




export const getTopDoctors = async (req, res) => {
    try {
        const topDoctors = await Doctor.aggregate([
            {
                $match: {
                    isVerified: true,
                    rating: { $in: [5, 4, 3, 2, 1, 0] }
                }
            },

            {
                $sort: { rating: -1 }
            },
            {
                $limit: 50 // take top 50 rated
            },
            {
                $sample: { size: 10 } // randomly pick 10 among them
            },
            {
                $project: {
                    fullName: 1,
                    specialization: 1,
                    yearsOfExperience: 1,
                    city: 1,
                    rating: 1
                }
            }
        ]);

        res.status(200).json({ topDoctors: topDoctors });
    } catch (error) {
        console.error('Error fetching top doctors:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


export const filterDoctors = async (req, res) => {
    try {
        const {
            city = 'all',
            rating = '',
            yearsOfExperience = 'all',
            fee = 1000,
            speciality = 'all'
        } = req.query;

        // Convert fee to a number
        const feeNumber = Number(fee);
        console.log("Type of fee after conversion:", typeof feeNumber);  // Log the type before conversion
        console.log("Type of rating before conversion:", typeof rating);  // Log the type of rating

        const query = {
            isVerified: true,
            consultationFee: { $lte: feeNumber }
        };

        console.log("Query object with fee:", query); // Log query object after fee conversion

        // Filter by city
        if (city !== 'all') {
            query.city = city;
        }

        // ✅ Filter by rating (single value or multiple)
        if (rating) {
            const ratingNumber = Number(rating);
            console.log("Converted rating:", ratingNumber);  // Check converted rating value

            if (!isNaN(ratingNumber)) {
                query.rating = { $gte: ratingNumber }; // Use $gte to filter doctors with rating >= given rating
                console.log("Applying rating filter: ", query.rating);
            }
        }

        // ✅ Filter by years of experience (parse string range)
        if (yearsOfExperience !== 'all') {
            if (yearsOfExperience.includes('-')) {
                const [min, max] = yearsOfExperience.split('-').map(Number);
                query.yearsOfExperience = { $gte: min, $lte: max };
            } else if (yearsOfExperience === '10+') {
                query.yearsOfExperience = { $gt: 10 };
            }
        }

        // Filter by speciality
        if (speciality !== 'all') {
            query.speciality = speciality;
        }

        console.log("Final Query Object:", query);  // Log the final query before querying the DB

        // Execute the query
        const doctors = await Doctor.find(query).select(
            'fullName qualification specialization profilePic yearsOfExperience rating currentWorking city consultationFee  availableSlots'
        );

        if (doctors.length > 0) {
            console.log("Doctors Found:", doctors);  // Log doctors found
        } else {
            console.log("No doctors found for the query.");
        }

        res.status(200).json({ doctors });
    } catch (error) {
        console.error('Error searching doctors:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};





export const getDoctor = async (req, res) => {
    try {
        const { docid } = req.query;

        if (!docid) {
            return res.status(400).json({ message: 'Doctor ID is required' });
        }

        const doctor = await Doctor.findById(docid).populate('availableSlots');

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        res.status(200).json({ doctor });
    } catch (error) {
        console.error('Error fetching doctor:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



export const DoctorLogin = async (req, res) => {
    try {
        //zod validation for inputted fields
        const validatedData = req.body;
        //extract what is coming in request
        const { emailId, password } = validatedData;
        //check if email exist in db
        const user = await Doctor.findOne({
            emailId: emailId
        })
        //if user doen't exists
        console.log("hello")
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
            role: "doctor"
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


