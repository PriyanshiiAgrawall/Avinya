
import Appointment from '../Models/Appointment.js';
import Doctor from '../Models/Doctor.js';
import Patient from '../Models/Patient.js'


export const bookAppointment = async (req, res) => {
    try {
        const {
            patientId,
            doctorId,
            appointmentDate,
            appointmentTime,
            mode
        } = req.body;

        // Validate required fields
        if (!patientId || !doctorId || !appointmentDate || !appointmentTime || !mode) {
            return res.status(400).json({ message: 'All fields are required' });
        }


        const doctorExists = await Doctor.findById(doctorId);
        const patientExists = await patient.findById(patientId);

        if (!doctorExists || !patientExists) {
            return res.status(404).json({ message: 'Doctor or patient not found' });
        }

        const existingAppointment = await Appointment.findOne({
            doctor: doctorId,
            appointmentDate,
            appointmentTime
        });

        if (existingAppointment) {
            return res.status(409).json({ message: 'Slot already booked' });
        }

        // Create appointment
        const newAppointment = new Appointment({
            patient: patientId,
            doctor: doctorId,
            appointmentDate,
            appointmentTime,
            mode,
            status: 'active', // initialize if needed
        });

        await newAppointment.save();

        res.status(201).json({
            message: 'Appointment booked successfully',
            appointment: newAppointment
        });

    } catch (error) {
        console.error('Error booking appointment:', error);
        res.status(500).json({ message: 'Server error while booking appointment' });
    }
};
