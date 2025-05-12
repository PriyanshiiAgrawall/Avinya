"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import CommonBanner from "@/UI/CommonBanner";

const AdminPage = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchUnverifiedDoctors = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/doctor/unverified-doctors`
        );
        setDoctors(res.data.doctors || []);
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
      }
    };

    fetchUnverifiedDoctors();
  }, []);

  const handleAction = async (id, action) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/doctor/verify`, {
        doctorId: id,
        action
      });

      if (action === "approve" || action === "reject") {
        setDoctors((prev) => prev.filter((doc) => doc._id !== id));
      }
    } catch (error) {
      console.error(`Failed to ${action} doctor:`, error);
    }
  };

  return (
    <div className="p-6">
      <CommonBanner title="Admin" routeName="admin" />
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard - Doctors</h1>

      {doctors.length === 0 ? (
        <p>No unverified doctors.</p>
      ) : (
        doctors.map((doc) => (
          <div key={doc._id} className="border p-6 mb-6 rounded shadow-md bg-white space-y-4">
            <div className="flex items-center space-x-4">
              <img
                src={doc.profilePic}
                alt={`${doc.fullName}'s profile`}
                className="w-24 h-24 rounded-full object-cover border"
              />
              <div>
                <h2 className="text-xl font-semibold">{doc.fullName}</h2>
                <p>Email: {doc.email}</p>
                <p>Phone: {doc.phoneNumber}</p>
                <p>Specialization: {doc.specialization}</p>
                <p>Qualification: {doc.qualification}</p>
                <p>Experience: {doc.yearsOfExperience} years</p>
                <p>City: {doc.city}</p>
                <p>Currently working at: {doc.currentWorking}</p>
                <p>Current Address: {doc.address}</p>
                <p>About: {doc.about}</p>
                <p>ConsultationFee: {doc.consultationFee}</p>
                <div>
                  <h3 className="font-semibold mb-2 mt-4">Available Slots:</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                    {Object.entries(doc.availableSlots || {}).map(([day, slots]) => (
                      <div key={day} className="bg-gray-100 p-3 rounded shadow-sm">
                        <p className="font-medium text-gray-800">{day}</p>
                        {slots.length > 0 ? (
                          <ul className="list-disc ml-5 text-gray-700">
                            {slots.map((slot, index) => (
                              <li key={index}>{slot}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500 italic">No slots</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Certificates:</h3>
              <div className="flex flex-wrap gap-4">
                {doc.certificates?.length > 0 ? (
                  doc.certificates.map((url, idx) => (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      key={idx}
                      className="block border rounded overflow-hidden hover:shadow-lg transition"
                    >
                      <img src={url} alt={`Certificate ${idx + 1}`} className="h-40 object-cover" />
                    </a>
                  ))
                ) : (
                  <p>No certificates uploaded.</p>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => handleAction(doc._id, "approve")}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Approve
              </button>
              <button
                onClick={() => handleAction(doc._id, "reject")}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminPage;
