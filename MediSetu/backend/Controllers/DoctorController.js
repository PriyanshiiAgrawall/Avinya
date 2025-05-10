import Doctor from '../Models/Doctor.js';
import bcrypt from 'bcrypt';

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
            certificates
        } = req.body;

        // Check if doctor already exists
        const existingDoctor = await Doctor.findOne({ email });
        if (existingDoctor) {
            return res.status(400).json({ message: 'Doctor already registered with this email' });
        }

        // Hash password
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
            availableSlots,
            certificates,
            isVerified: false, // Default until admin approves
        });

        await newDoctor.save();
        // Upload the documents and get the URLs
        const uploadedUrls = await uploadDoctorCertifications(files, id);

        // Update the doctor's record with the new certificate URLs
        const updatedDoctor = await Doctor.findByIdAndUpdate(
            id,
            { $set: { certificates: uploadedUrls } },
            { new: true }
        );

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
                    rating: { $exists: true }
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
            rating = 'all',
            experience = 'all',
            fee = 1000,
            speciality = 'all'
        } = req.query;

        const query = {
            isVerified: true,
            consultationFee: { $lte: Number(fee) }
        };

        // Filter by city
        if (city !== 'all') {
            query.city = city;
        }

        // Filter by rating
        if (rating !== 'all') {
            query.rating = { $gte: Number(rating) };
        }

        // Filter by years of experience
        if (yearsOfExperience !== 'all') {
            query.experience = { $gte: Number(experience) };
        }

        // Filter by speciality
        if (specialization !== 'all') {
            query.speciality = speciality;
        }

        const doctors = await Doctor.find(query).select(
            'name specialization rating consultationFee yearsOfExperience city'
        );

        res.status(200).json({ doctors: doctors });
    } catch (error) {
        console.error('Error searching doctors:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


export const getDoctor = async (req, res) => {
    try {
        const { docid } = req.body;

        if (!docid) {
            return res.status(400).json({ message: 'Doctor ID is required' });
        }

        const doctor = await Doctor.findById(docid).populate('appointments');

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        res.status(200).json({ doctor });
    } catch (error) {
        console.error('Error fetching doctor:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



