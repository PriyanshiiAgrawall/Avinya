"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useEffect } from "react";
const specializations = ["Cardiology", "Dermatology", "Neurology", "Pediatrics", "Psychiatry"];
const cities = ["Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata"];
const times = Array.from({ length: 16 }, (_, i) => `${6 + i}:00`);
const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const Register = () => {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/");
    }
  }, []);
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState("patient"); // 'patient' or 'doctor'
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    profilePic: null,
    specialization: "",
    yearsOfExperience: "",
    address: "",
    currentWorking: "",
    city: "",
    consultationFee: "",
    about: "",
    certificates: [], // doctor will upload file multiple files upto 10 in images
    availableSlots: weekdays.reduce((acc, day) => ({ ...acc, [day]: [] }), {}),
    qualification: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const [expandedDays, setExpandedDays] = useState({});

  const toggleDay = (day) => {
    setExpandedDays((prev) => ({
      ...prev,
      [day]: !prev[day]
    }));
  };

  const handleFileChange = (e, field, isMultiple = false) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      [field]: isMultiple ? files.slice(0, 10) : files[0]
    }));
  };

  const toggleSlot = (day, time) => {
    setFormData((prev) => {
      const daySlots = prev.availableSlots[day];
      return {
        ...prev,
        availableSlots: {
          ...prev.availableSlots,
          [day]: daySlots.includes(time) ? daySlots.filter((t) => t !== time) : [...daySlots, time]
        }
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const form = new FormData();
    form.append("userType", userType);
    form.append("fullName", formData.fullName);
    form.append("email", formData.email);
    form.append("password", formData.password);

    if (userType === "doctor") {
      if (!formData.profilePic) {
        toast.error("Please upload a profile picture.");
        setIsLoading(false);
        return;
      }

      const validCertificates = formData.certificates.filter((cert) => cert !== null);
      if (validCertificates.length === 0) {
        toast.error("Please upload a profile picture.");
        setIsLoading(false);
        return;
      }

      const hasSlot = Object.values(formData.availableSlots).some((slots) => slots.length > 0);
      if (!hasSlot) {
        toast.error("Please select at least one available slot.");
        setIsLoading(false);
        return;
      }

      if (!formData.specialization || formData.specialization === "Select") {
        toast.error("Please choose a specialization.");
        setIsLoading(false);
        return;
      }

      form.append("phoneNumber", formData.phoneNumber);
      form.append("specialization", formData.specialization);
      form.append("yearsOfExperience", formData.yearsOfExperience);
      form.append("address", formData.address);
      form.append("currentWorking", formData.currentWorking);
      form.append("city", formData.city);
      form.append("consultationFee", formData.consultationFee);
      form.append("about", formData.about);
      form.append("qualification", formData.qualification);

      // Append profilePic as a file
      form.append("profilePic", formData.profilePic); // should be a File object

      // Append multiple certificate files
      formData.certificates.forEach((file) => {
        if (file) form.append("certificates", file); // certificates[]
      });

      // Send slots as JSON string
      form.append("availableSlots", JSON.stringify(formData.availableSlots));
    }

    try {
      let response;
      if (userType === "doctor") {
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/doctor/registerDoc`,
          form,
          {
            headers: { "Content-Type": "multipart/form-data" }
          }
        );
      } else if (userType === "patient") {
        console.log(form);
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/patient/registerPatient`,
          form
        );
      }

      if (response.status === 200 || response.status === 201) {
        toast.success("Registration successful! Please login.");
        router.push("/login");
      }
    } catch (error) {
      console.error("Registration failed:", error.response?.data || error.message);
      toast.error("Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-[500px] h-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          {userType === "patient"
            ? "Join MediSetu: Care that comes to you"
            : "Join MediSetu: Your expertise can save someone's life"}
        </h2>

        <div className="flex justify-center mb-6">
          <button
            type="button"
            onClick={() => setUserType("patient")}
            className={`px-6 py-2 rounded-l-lg font-medium ${userType === "patient" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            I'm a Patient
          </button>
          <button
            type="button"
            onClick={() => setUserType("doctor")}
            className={`px-6 py-2 rounded-r-lg font-medium ${userType === "doctor" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            I'm a Doctor
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              disabled={isLoading}
              id="fullName"
              name="fullName"
              type="text"
              required
              value={formData.fullName}
              onChange={handleChange}
              className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm
                      focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Sejal Gupta"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              disabled={isLoading}
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm
                      focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="sejal@example.com"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Create Password
            </label>
            <input
              disabled={isLoading}
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm
                      focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="••••••••"
            />
            <p className="text-xs text-gray-500">
              Use at least 8 characters with a mix of letters and numbers
            </p>
          </div>

          {/* Doctor-specific fields */}
          {userType === "doctor" && (
            <>
              <div className="space-y-2">
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  disabled={isLoading}
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm
                          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="+1234567890"
                />
              </div>

              <div className="space-y-2">
                <Select
                  label="Specialization"
                  name="specialization"
                  value={formData.specialization}
                  options={specializations}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm
                          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Cardiology"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="yearsOfExperience"
                  className="block text-sm font-medium text-gray-700"
                >
                  Years of Experience
                </label>
                <input
                  disabled={isLoading}
                  id="yearsOfExperience"
                  name="yearsOfExperience"
                  type="number"
                  required
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm
                          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="5"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  disabled={isLoading}
                  id="address"
                  name="address"
                  type="text"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm
                          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="123 Main St"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="currentWorking" className="block text-sm font-medium text-gray-700">
                  Current Workplace
                </label>
                <input
                  disabled={isLoading}
                  id="currentWorking"
                  name="currentWorking"
                  type="text"
                  required
                  value={formData.currentWorking}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm
                          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="City Hospital"
                />
              </div>

              <div className="space-y-2">
                <Select
                  label="City"
                  name="city"
                  value={formData.city}
                  options={cities}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm
                          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="consultationFee"
                  className="block text-sm font-medium text-gray-700"
                >
                  Consultation Fee (₹)
                </label>
                <input
                  disabled={isLoading}
                  id="consultationFee"
                  name="consultationFee"
                  type="number"
                  required
                  value={formData.consultationFee}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm
                          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="1000"
                />
              </div>
              <Input
                label="Qualification"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
              />
              <div className="space-y-2">
                <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                  About You
                </label>
                <textarea
                  id="about"
                  name="about"
                  required
                  value={formData.about}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm
                          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Tell patients about yourself and your experience"
                  rows="3"
                />
              </div>
              <div className="space-y-2">
                <FileInput
                  label="Profile Picture"
                  name="profilePic"
                  onChange={(e) => handleFileChange(e, "profilePic")}
                />
                {/* className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm
                          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"  */}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Certificates (up to 10)
                </label>
                {formData.certificates.map((file, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      disabled={isLoading}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const files = Array.from(e.target.files);
                        if (files.length > 0) {
                          setFormData((prev) => {
                            const newCerts = [...prev.certificates];
                            newCerts[index] = files[0];
                            return { ...prev, certificates: newCerts };
                          });
                        }
                      }}
                      className="block w-full px-2 py-1 bg-gray-50 border border-gray-300 rounded-lg text-sm"
                    />
                    {index >= 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            certificates: prev.certificates.filter((_, i) => i !== index)
                          }));
                        }}
                        className="text-red-500 hover:underline text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                {formData.certificates.length < 10 && (
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        certificates: [...prev.certificates, null]
                      }))
                    }
                    className="text-indigo-600 hover:underline text-sm"
                  >
                    + Add More
                  </button>
                )}
              </div>
            </>
          )}
          {userType === "doctor" ? (
            <div>
              <label className=" block text-sm font-medium text-gray-700 mb-2">
                Available Slots
              </label>
              {weekdays.map((day) => (
                <div key={day} className="mb-4 border rounded-md p-2 bg-gray-50">
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleDay(day)}
                  >
                    <p className=" text-sm font-semibold text-gray-800">{day}</p>
                    <button
                      type="button"
                      className="text-lg font-bold text-gray-600 focus:outline-none"
                    >
                      {expandedDays[day] ? "-" : "+"}
                    </button>
                  </div>

                  {expandedDays[day] && (
                    <div className="mt-2 grid grid-cols-4 gap-2">
                      {times.map((time) => (
                        <button
                          type="button"
                          key={time}
                          className={`px-2 py-1 text-xs rounded-md border ${
                            formData.availableSlots[day].includes(time)
                              ? "bg-indigo-600 text-white"
                              : "bg-white border-gray-300"
                          }`}
                          onClick={() => toggleSlot(day, time)}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            ""
          )}

          <div className="flex items-center">
            <input
              disabled={isLoading}
              id="agree-terms"
              name="agree-terms"
              type="checkbox"
              required
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-700">
              I agree to the{" "}
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                Privacy Policy
              </a>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                    ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Registering...
              </>
            ) : (
              `Register as ${userType === "patient" ? "Patient" : "Doctor"}`
            )}
          </button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a href="login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in here
            </a>
          </p>

          <p className="text-xs text-center text-gray-500">
            Your information is protected with 256-bit encryption
          </p>
        </form>
      </div>
    </div>
  );
};

const Input = ({ label, name, type = "text", ...rest }) => (
  <div className="space-y-1">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      className="w-full px-3 py-2 border border-gray-300 rounded-md"
      {...rest}
    />
  </div>
);

const Select = ({ label, name, value, options, onChange }) => (
  <div className="space-y-1">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-md"
    >
      <option value="">Select</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

const TextArea = ({ label, name, ...rest }) => (
  <div className="space-y-1">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <textarea
      id={name}
      name={name}
      rows="3"
      className="w-full px-3 py-2 border border-gray-300 rounded-md"
      {...rest}
    ></textarea>
  </div>
);

const FileInput = ({ label, name, multiple = false, onChange }) => (
  <div className="space-y-1">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      id={name}
      name={name}
      type="file"
      multiple={multiple}
      accept="image/*"
      onChange={onChange}
    />
  </div>
);

export default Register;
