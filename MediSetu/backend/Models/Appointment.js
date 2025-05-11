import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    appointmentDate: {
        type: String,
        required: true
    },
    appointmentTime: {
        type: String,
        required: true
    },
    mode: {
        type: String,
        enum: ['virtual', 'physical'],
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'completed'],
        default: 'active'
    },
    prescriptionUrl: {
        type: String
    },
    transcriptionUrl: {
        type: String
    },
    sessionId: {
        type: String // could be used for linking WebRTC/Video session
    }
}, {
    timestamps: true // adds createdAt and updatedAt
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
