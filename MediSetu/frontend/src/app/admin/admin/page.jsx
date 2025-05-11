"use client";
import React, { useState } from "react";
import CommonBanner from "@/UI/CommonBanner";
const AdminPage = () => {
  const [doctors, setDoctors] = useState([
    { id: 1, name: "Dr. Harsh", verified: false },
    { id: 2, name: "Dr. Meera", verified: false }
  ]);

  const handleVerify = (id) => {
    setDoctors((prev) => prev.map((doc) => (doc.id === id ? { ...doc, verified: true } : doc)));
  };

  const handleReject = (id) => {
    setDoctors((prev) => prev.filter((doc) => doc.id !== id));
  };

  return (
    <div className="p-6">
      <CommonBanner title=" Admin" routeName="admin" />
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard - Doctors</h1>
      {doctors.map((doc) => (
        <div
          key={doc.id}
          className="border p-4 mb-3 rounded shadow-md flex justify-between items-center"
        >
          <div>{doc.name}</div>
          <div>
            {doc.verified ? (
              <span className="text-green-600 font-semibold">Verified</span>
            ) : (
              <>
                <button
                  onClick={() => handleVerify(doc.id)}
                  className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                >
                  Verify
                </button>
                <button
                  onClick={() => handleReject(doc.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Reject
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminPage;
