"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Star, Clock, Calendar, Home as Hospital, Video, MapPin, Briefcase } from "react-feather";
import Image from "next/image";
import { alterredUserAvatar } from "@/utils/appHelpers";
import AppBreadcrumb from "@/UI/AppBreadCrumb";
import useMediaQuery from "@/hooks/useMediaQuery";
import BookAppointmentButton from "./BookAppointmentButton";

const SingleDoctor = ({ id }) => {
  const [activeTab, setActiveTab] = useState("info");
  const isMobileScreen = useMediaQuery("(max-width: 768px)");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [currentMonth] = useState(new Date().getMonth());
  const [currentYear] = useState(new Date().getFullYear());
  const [consultationMode, setConsultationMode] = useState("physical");
  const [doctorData, setDoctorData] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/doctor/getDoctor?docid=${id}`);
        setDoctorData(response.data.doctor);
      } catch (error) {
        console.error("Error fetching doctor:", error);
      }
    };

    fetchDoctor();
  }, [id]);

  useEffect(() => {
    if (!doctorData || selectedDate === null) return;

    const selectedFullDate = new Date(currentYear, currentMonth, selectedDate);
    const dayOfWeek = selectedFullDate.toLocaleDateString("en-US", { weekday: "long" });

    const slots = doctorData.availableSlots?.[dayOfWeek] || [];
    setAvailableSlots(slots);
  }, [doctorData, selectedDate]);

  const breadcrumbList = [
    { title: "All Doctors", href: "/all-doctors" },
    { title: "Single Doctor", activeLink: true }
  ];

  if (!doctorData) {
    return <div className="min-h-screen flex justify-center items-center">Loading details...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex flex-wrap justify-start items-center lg:flex-row">
          {breadcrumbList.map((item, index) => (
            <AppBreadcrumb
              key={item.title}
              breadcrumbList={breadcrumbList}
              item={item}
              index={index}
              href={item.href}
              isMobileScreen={isMobileScreen}
              breadcrumbListLength={breadcrumbList.length}
            />
          ))}
        </div>

        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <div className="relative w-48 h-48">
                <Image
                  src={doctorData?.profilePic || alterredUserAvatar}
                  alt="Doctor profile"
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex-grow space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{doctorData.fullName}</h1>
                <p className="text-gray-600">{doctorData.qualification}</p>
                <span className="inline-block mt-2 px-3 py-1 text-sm font-semibold bg-blue-500 text-white rounded-full">
                  {doctorData.specialization}
                </span>
              </div>

              <div className="flex flex-wrap gap-6">
                <div>
                  <p className="text-sm text-gray-600">Total Experience</p>
                  <p className="font-semibold">{doctorData.yearsOfExperience} yrs</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Rating</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{doctorData.rating}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">City</p>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="font-semibold">{doctorData.city}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Currently Working At</p>
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4 text-gray-500" />
                    <span className="font-semibold">{doctorData.currentWorking}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Working Address</p>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="font-semibold">{doctorData.address}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Fee */}
            <div className="flex flex-col items-end gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Consultation Fee</p>
                <span className="text-black-400">₹{doctorData.consultationFee}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="flex border-b">
            {["info", "qualification", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium capitalize ${activeTab === tab ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === "info" && (
              <div className="grid md:grid-cols-2 gap-6">
                {/* About & Consultation Mode */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">About Doctor</h2>
                  <p className="text-gray-600">{doctorData.about}</p>

                  <div className="mt-6">
                    <h3 className="font-medium mb-3">Consultation Mode</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {["physical", "virtual"].map((mode) => (
                        <button
                          key={mode}
                          className={`p-4 border rounded-lg text-center transition-colors ${consultationMode === mode
                            ? "border-blue-500 bg-blue-50 text-blue-600"
                            : "border-gray-300 hover:bg-gray-50"
                            }`}
                          onClick={() => setConsultationMode(mode)}
                        >
                          <div className="flex flex-col items-center">
                            {mode === "physical" ? (
                              <Hospital className="w-6 h-6 mb-2" />
                            ) : (
                              <Video className="w-6 h-6 mb-2" />
                            )}
                            <span>{mode === "physical" ? "Physical Visit" : "Virtual Consultation"}</span>
                            <p className="text-sm text-gray-500 mt-1">
                              {mode === "physical" ? "Visit doctor's chamber" : "Video call with doctor"}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Book Appointment */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Book Appointment</h2>
                  <div className="space-y-6">
                    {/* Date Picker */}
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                      <h3 className="font-medium mb-3">
                        {new Date(currentYear, currentMonth).toLocaleString("default", {
                          month: "long",
                          year: "numeric"
                        })}
                      </h3>
                      <div className="grid grid-cols-7 gap-1 mb-3">
                        {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                          <div
                            key={day}
                            className="text-center text-sm font-medium text-gray-500"
                          >
                            {day}
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {Array.from(
                          { length: new Date(currentYear, currentMonth + 1, 0).getDate() },
                          (_, i) => i + 1
                        ).map((date) => (
                          <button
                            key={date}
                            className={`h-10 rounded-full flex items-center justify-center ${date === selectedDate ? "bg-blue-500 text-white" : "hover:bg-gray-100"
                              }`}
                            onClick={() => {
                              setSelectedDate(date);
                              setSelectedTime(""); // reset time
                            }}
                          >
                            {date}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Time Slot Dropdown */}
                    <div>
                      <h3 className="font-medium mb-3">Available Time Slots</h3>
                      <select
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        disabled={availableSlots.length === 0}
                      >
                        <option value="">Select a time slot</option>
                        {availableSlots.map((slot, index) => (
                          <option key={index} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                      {availableSlots.length === 0 && selectedDate !== null && (
                        <p className="text-sm text-red-500 mt-2">No slots available on selected date</p>
                      )}
                    </div>

                    {/* Appointment Summary */}
                    {selectedDate && selectedTime && (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Your Appointment</h4>
                        <p>
                          <strong>Date:</strong>{" "}
                          {new Date(currentYear, currentMonth, selectedDate).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "long",
                            year: "numeric"
                          })}
                        </p>
                        <p>
                          <strong>Time:</strong> {selectedTime}
                        </p>
                      </div>
                    )}

                    {/* Book Button */}
                    <BookAppointmentButton
                      doctorData={doctorData}
                      selectedDate={selectedDate}
                      selectedTime={selectedTime}
                      consultationMode={consultationMode}
                      consultationFee={doctorData.consultationFee}
                    />


                  </div>
                </div>
              </div>
            )}

            {activeTab === "qualification" && (
              <p className="text-gray-600">{doctorData.qualification}</p>
            )}

            {activeTab === "reviews" && (
              <p className="text-gray-600">Customer Reviews</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SingleDoctor;
