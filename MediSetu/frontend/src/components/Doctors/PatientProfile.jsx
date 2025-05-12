"use client";
import React, { useEffect, useState } from "react";
import CommonBanner from "@/UI/CommonBanner";
import {
  FaUserMd,
  FaCalendarAlt,
  FaClock,
  FaVideo,
  FaFilePrescription,
  FaFileAlt,
  FaUser,
  FaEnvelope,
  FaPhone
} from "react-icons/fa";
import axios from "axios";
import { useRouter } from "next/navigation";

const PatientProfile = () => {
  const [appointments, setAppointments] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      if (!user || !token) {
        router.push("/login");
        return;
      }

      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/patient/getPatient`,
          {
            params: { patientId: user._id }
          }
        );

        console.log("Fetched patient data:", res.data);

        if (res.data.patient && res.data.patient.appointments) {
          setAppointments(res.data.patient.appointments);
          setUserDetails(res.data.patient);
        }
      } catch (error) {
        console.error("Failed to fetch patient profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  // Helper function to create a proper date object from appointment date and time
  const createAppointmentDate = (date, time) => {
    const [hours, minutes, period] = time.match(/(\d+):(\d+)\s*(AM|PM)/).slice(1);
    let hour = parseInt(hours);
    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    return new Date(currentYear, currentMonth, parseInt(date), hour, parseInt(minutes));
  };

  const now = new Date();
  console.log("Current time:", now);

  const upcoming = appointments.filter((appointment) => {
    const appointmentDate = createAppointmentDate(
      appointment.appointmentDate,
      appointment.appointmentTime
    );
    console.log("Appointment date:", appointmentDate, "for appointment:", appointment._id);
    return appointmentDate > now;
  });

  const past = appointments.filter((appointment) => {
    const appointmentDate = createAppointmentDate(
      appointment.appointmentDate,
      appointment.appointmentTime
    );
    return appointmentDate <= now;
  });

  console.log("Upcoming appointments:", upcoming);
  console.log("Past appointments:", past);

  const isAppointmentTime = (date, time) => {
    const scheduled = createAppointmentDate(date, time);
    return Math.abs(scheduled - now) <= 60 * 1000;
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <CommonBanner title="Patient Profile" routeName="PatientProfile" />
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Patient Dashboard</h1>
          <div className="text-center">Loading appointments...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <CommonBanner title="Patient Profile" routeName="PatientProfile" />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Welcome, {userDetails?.name || "Patient"}
        </h1>

        {/* PATIENT DETAILS */}
        {userDetails && (
          <div className="bg-white p-6 rounded-xl shadow-md mb-10 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Patient Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
              <div className="flex items-center gap-2">
                <FaUser className="text-blue-500" />
                <span>
                  <strong>Name:</strong> {userDetails.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaEnvelope className="text-green-500" />
                <span>
                  <strong>Email:</strong> {userDetails.email}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaPhone className="text-purple-500" />
                <span>
                  <strong>Phone:</strong> {userDetails.phone || "N/A"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* UPCOMING APPOINTMENTS */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">Upcoming Appointments</h2>
          {upcoming.length === 0 ? (
            <p className="text-gray-600 text-center">No upcoming appointments</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((a) => (
                <div
                  key={a._id}
                  className="bg-white p-6 rounded-xl shadow-md border border-gray-200"
                >
                  <div className="flex items-center gap-3 text-gray-700 mb-2">
                    <FaUserMd className="text-blue-500" />
                    <span className="font-semibold">Doctor:</span>{" "}
                    {a.doctor?.fullName || "Loading..."}
                  </div>
                  <div className="flex items-center gap-3 text-gray-700 mb-2">
                    <FaCalendarAlt className="text-green-500" />
                    <span className="font-semibold">
                      Date:
                    </span> {a.appointmentDate}
                  </div>
                  <div className="flex items-center gap-3 text-gray-700 mb-2">
                    <FaClock className="text-yellow-500" />
                    <span className="font-semibold">
                      Time:
                    </span> {a.appointmentTime}
                  </div>
                  <div className="flex items-center gap-3 text-gray-700 mb-2">
                    <FaVideo className="text-purple-500" />
                    <span className="font-semibold">
                      Mode:
                    </span> {a.mode}
                  </div>

                  {isAppointmentTime(a.appointmentDate, a.appointmentTime) ? (
                    <a
                      href={`/start/${a.sessionId}`}
                      className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700"
                    >
                      Start Appointment
                    </a>
                  ) : (
                    <button
                      disabled
                      className="mt-4 px-4 py-2 bg-gray-400 text-white font-medium rounded cursor-not-allowed"
                    >
                      Waiting for time...
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* PAST APPOINTMENTS */}
        <section>
          <h2 className="text-2xl font-semibold text-green-700 mb-4">Past Appointments</h2>
          {past.length === 0 ? (
            <p className="text-gray-600 text-center">No past appointments</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {past.map((a) => (
                <div
                  key={a._id}
                  className="bg-white p-6 rounded-xl shadow-md border border-gray-200"
                >
                  <div className="flex items-center gap-3 text-gray-700 mb-2">
                    <FaUserMd className="text-blue-500" />
                    <span className="font-semibold">Doctor:</span>{" "}
                    {a.doctor?.fullName || "Loading..."}
                  </div>
                  <div className="flex items-center gap-3 text-gray-700 mb-2">
                    <FaCalendarAlt className="text-green-500" />
                    <span className="font-semibold">
                      Date:
                    </span> {a.appointmentDate}
                  </div>
                  <div className="flex items-center gap-3 text-gray-700 mb-2">
                    <FaClock className="text-yellow-500" />
                    <span className="font-semibold">
                      Time:
                    </span> {a.appointmentTime}
                  </div>

                  <div className="mt-2">
                    <p className="font-semibold text-gray-700 mb-1">Prescription:</p>
                    {a.prescriptionUrl ? (
                      <a
                        href={a.prescriptionUrl}
                        target="_blank"
                        className="inline-flex items-center gap-2 text-blue-600 hover:underline"
                        download
                      >
                        <FaFilePrescription />
                        Download Prescription
                      </a>
                    ) : (
                      <span className="italic text-gray-400">Not available</span>
                    )}
                  </div>

                  <div className="mt-3">
                    <p className="font-semibold text-gray-700 mb-1">Summary:</p>
                    {a.transcriptionUrl ? (
                      <a
                        href={a.transcriptionUrl}
                        target="_blank"
                        className="inline-flex items-center gap-2 text-green-600 hover:underline"
                        download
                      >
                        <FaFileAlt />
                        Download Summary
                      </a>
                    ) : (
                      <span className="italic text-gray-400">Not available</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default PatientProfile;
