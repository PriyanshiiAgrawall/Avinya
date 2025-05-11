import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    specialization: {
        type: String,
        required: true
    },
    yearsOfExperience: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    currentWorking: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    consultationFee: {
        type: Number,
        default: 1000
    },
    rating: {
        type: Number,
        default: 0,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    certificates: [
        {
            type: String
        }
    ],
    availableSlots: {
        Monday: [String],// [10:30a.m., 11:00a.m.]
        Tuesday: [String],
        Wednesday: [String],
        Thursday: [String],
        Friday: [String],
        Saturday: [String],
        Sunday: [String]
    },
    about: {
        type: String,
        default: "hello,I am a Doctor"
    },
    profilePic: {
        type: String,
    },
    qualification: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
});

const Doctor = mongoose.model('Doctor', doctorSchema);
export default Doctor;
