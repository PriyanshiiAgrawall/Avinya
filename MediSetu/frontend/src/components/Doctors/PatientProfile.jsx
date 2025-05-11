"use client";
import React from "react";
import CommonBanner from "@/UI/CommonBanner";
import { FaUserMd, FaCalendarAlt, FaFilePrescription, FaFileAlt } from "react-icons/fa";

const PatientProfile = () => {
  const appointments = [
    {
      id: 1,
      doctor: "Dr. Harsh",
      date: "2025-04-15",
      prescription: "prescription1.pdf",
      summary: "summary1.pdf"
    },
    {
      id: 2,
      doctor: "Dr. Meera",
      date: "2025-05-12",
      prescription: null,
      summary: null
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <CommonBanner title="Patient Profile" routeName="PatientProfile" />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Patient Dashboard</h1>

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {appointments.map((a) => (
            <div
              key={a.id}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition duration-300"
            >
              <div className="flex items-center gap-3 mb-3 text-gray-700">
                <FaUserMd className="text-blue-500" />
                <span className="font-semibold">
                  Doctor:
                </span> {a.doctor}
              </div>

              <div className="flex items-center gap-3 mb-3 text-gray-700">
                <FaCalendarAlt className="text-green-500" />
                <span className="font-semibold">
                  Date:
                </span> {a.date}
              </div>

              <div className="mb-2">
                <p className="font-semibold text-gray-700 mb-1">Prescription:</p>
                {a.prescription ? (
                  <a
                    href={`/${a.prescription}`}
                    target="_blank"
                    className="inline-flex items-center gap-2 text-blue-600 hover:underline"
                  >
                    <FaFilePrescription />
                    View Prescription
                  </a>
                ) : (
                  <span className="italic text-gray-400">Not available</span>
                )}
              </div>

              <div className="mt-3">
                <p className="font-semibold text-gray-700 mb-1">Summary:</p>
                {a.summary ? (
                  <a
                    href={`/${a.summary}`}
                    target="_blank"
                    className="inline-flex items-center gap-2 text-green-600 hover:underline"
                  >
                    <FaFileAlt />
                    View Summary
                  </a>
                ) : (
                  <span className="italic text-gray-400">Not available</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
