"use client";
import React from "react";
import CommonBanner from "@/UI/CommonBanner";
import { FaFilePrescription, FaPlus, FaCalendarAlt, FaClock } from "react-icons/fa";

const DoctorProfile = () => {
  const appointments = [
    {
      id: 1,
      date: "2025-04-20",
      time: "10:00 AM",
      status: "past",
      prescription: "prescription1.pdf",
      summary: "summary1.pdf"
    },
    {
      id: 2,
      date: "2025-05-12",
      time: "11:30 AM",
      status: "upcoming",
      prescription: null,
      summary: "summary2.pdf"
    }
  ];

  const handleAddPrescription = (id) => {
    alert(`Add Prescription for Appointment ID ${id}`);
  };

  const renderAppointments = (status) =>
    appointments
      .filter((a) => a.status === status)
      .map((appointment) => (
        <div
          key={appointment.id}
          className="bg-white shadow-lg rounded-xl p-5 transition-transform hover:scale-[1.02] border border-gray-200"
        >
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2 text-gray-700">
              <FaCalendarAlt className="text-blue-500" />
              <span>{appointment.date}</span>
              <FaClock className="text-green-500 ml-4" />
              <span>{appointment.time}</span>
            </div>

            <span
              className={`text-sm px-3 py-1 rounded-full font-semibold ${status === "upcoming" ? "bg-yellow-100 text-yellow-700" : "bg-gray-200 text-gray-700"}`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>

          <div className="mt-2">
            <p className="font-semibold mb-1">Prescription:</p>
            {appointment.prescription ? (
              <a
                href={`/${appointment.prescription}`}
                className="inline-flex items-center gap-2 text-blue-600 hover:underline"
                target="_blank"
              >
                <FaFilePrescription />
                View Prescription
              </a>
            ) : (
              <button
                onClick={() => handleAddPrescription(appointment.id)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded mt-1"
              >
                <FaPlus /> Add Prescription
              </button>
            )}
          </div>

          <div className="mt-4">
            <p className="font-semibold mb-1">Summary File:</p>
            {appointment.summary ? (
              <a
                href={`/${appointment.summary}`}
                className="text-green-600 hover:underline"
                target="_blank"
              >
                View Summary
              </a>
            ) : (
              <span className="text-gray-400 italic">Not available</span>
            )}
          </div>
        </div>
      ));

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <CommonBanner title="Doctor Profile" routeName="DoctorProfile" />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Doctor Dashboard</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          <section className="lg:w-1/2">
            <h2 className="text-2xl font-semibold text-blue-700 mb-4">Upcoming Appointments</h2>
            <div className="grid gap-6 sm:grid-cols-1">{renderAppointments("upcoming")}</div>
          </section>

          <section className="lg:w-1/2">
            <h2 className="text-2xl font-semibold text-green-700 mb-4">Past Appointments</h2>
            <div className="grid gap-6 sm:grid-cols-1">{renderAppointments("past")}</div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
