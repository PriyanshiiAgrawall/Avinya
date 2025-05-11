import React, { useState } from "react";

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState("patient"); // 'patient' or 'doctor'
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    // Doctor specific fields
    phoneNumber: "",
    specialization: "",
    yearsOfExperience: "",
    address: "",
    currentWorking: "",
    city: "",
    consultationFee: "",
    about: "",
    certificates: [],
    availableSlots: {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: []
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    
    // Prepare data based on user type
    const submitData = userType === 'patient' ? {
      name: formData.fullName,
      email: formData.email,
      password: formData.password
    } : {
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      phoneNumber: formData.phoneNumber,
      specialization: formData.specialization,
      yearsOfExperience: formData.yearsOfExperience,
      address: formData.address,
      currentWorking: formData.currentWorking,
      city: formData.city,
      consultationFee: formData.consultationFee,
      about: formData.about,
      certificates: formData.certificates,
      availableSlots: formData.availableSlots
    };

    // Simulate API call
    console.log("Submitting:", submitData);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    alert("Registration successful!");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Join Our Healthcare Network</h2>
      
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
            id="fullName"
            name="fullName"
            type="text"
            required
            value={formData.fullName}
            onChange={handleChange}
            className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm
                      focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="John Doe"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm
                      focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="m@example.com"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Create Password
          </label>
          <input
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
          <p className="text-xs text-gray-500">Use at least 8 characters with a mix of letters and numbers</p>
        </div>

        {/* Doctor-specific fields */}
        {userType === "doctor" && (
          <>
            <div className="space-y-2">
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
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
              <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">
                Specialization
              </label>
              <input
                id="specialization"
                name="specialization"
                type="text"
                required
                value={formData.specialization}
                onChange={handleChange}
                className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm
                          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Cardiology"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700">
                Years of Experience
              </label>
              <input
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
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                id="city"
                name="city"
                type="text"
                required
                value={formData.city}
                onChange={handleChange}
                className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm
                          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="New York"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="consultationFee" className="block text-sm font-medium text-gray-700">
                Consultation Fee (₹)
              </label>
              <input
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
              <label htmlFor="certificates" className="block text-sm font-medium text-gray-700">
                Certificates (Upload Links)
              </label>
              <input
                id="certificates"
                name="certificates"
                type="text"
                value={formData.certificates[0] || ""}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  certificates: [e.target.value]
                }))}
                className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm
                          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="https://example.com/certificate.pdf"
              />
              <p className="text-xs text-gray-500">You can add more certificates later in your profile</p>
            </div>
          </>
        )}

        <div className="flex items-center">
          <input
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
            `Register as ${userType === 'patient' ? 'Patient' : 'Doctor'}`
          )}
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have an account? <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Sign in here</a>
        </p>

        <p className="text-xs text-center text-gray-500">
          Your information is protected with 256-bit encryption
        </p>
      </form>
    </div>
  );
};

export default Register;