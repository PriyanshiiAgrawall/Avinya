import Appointment from '../Models/Appointment.js';
import Doctor from '../Models/Doctor.js';
import Patient from '../Models/Patient.js'


export const bookAppointment = async (req, res) => {
    try {
        const d = req.body;
        console.log("Request body:", d);
        const {
            patient,
            doctor,
            appointmentDate,
            appointmentTime,
            mode,
            status,
            prescriptionUrl,
            transcriptionUrl,
            sessionId
        } = req.body;
        console.log(req.body.patient)
        // Validate required fields
        if (!patient || !doctor || !appointmentDate || !appointmentTime || !mode) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const doctorExists = await Doctor.findById(doctor);
        const patientExists = await Patient.findById(patient);

        if (!doctorExists || !patientExists) {
            return res.status(404).json({ message: 'Doctor or patient not found' });
        }

        const existingAppointment = await Appointment.findOne({
            doctor: doctor,
            appointmentDate,
            appointmentTime
        });

        if (existingAppointment) {
            return res.status(409).json({ message: 'Slot already booked' });
        }

        // Create and save appointment
        const newAppointment = new Appointment(d);
        const savedAppointment = await newAppointment.save();

        // Update doctor's appointments array
        await Doctor.findByIdAndUpdate(
            doctor,
            { $push: { appointments: savedAppointment._id } }
        );

        // Update patient's appointments array
        await Patient.findByIdAndUpdate(
            patient,
            { $push: { appointments: savedAppointment._id } }
        );

        // Send success response with the saved appointment
        res.status(201).json({
            message: 'Appointment booked successfully',
            appointment: savedAppointment
        });

    } catch (error) {
        console.error('Error booking appointment:', error);
        res.status(500).json({ message: 'Server error while booking appointment' });
    }
};

