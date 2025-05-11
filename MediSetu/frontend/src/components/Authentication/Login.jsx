"use client";

import React, { useState } from "react";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState("patient"); // default role
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const payload = {
      email,
      password,
      role,
    };

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const endpoint =
        role === "doctor"
          ? `${baseUrl}/api/doctor/loginDoctor`
          : `${baseUrl}/api/patient/loginPatient`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        // Handle login success
        console.log("Login successful", data);
      } else {
        // Handle login failure
        alert(data.message || "Login failed");
      }
      console.log(data);
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));
    } catch (error) {
      console.error("Error logging in:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-[500px] h-auto p-6 bg-white rounded-lg shadow-md">
        {/* Role Toggle */}
        <div className="flex justify-center mb-6">
          <button
            type="button"
            onClick={() => setRole("patient")}
            className={`px-6 py-2 rounded-l-lg font-medium ${role === "patient" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"
              }`}
          >
            I'm a Patient
          </button>
          <button
            type="button"
            onClick={() => setRole("doctor")}
            className={`px-6 py-2 rounded-r-lg font-medium ${role === "doctor" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"
              }`}
          >
            I'm a Doctor
          </button>
        </div>


        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700 ">Welcome Back to <span className="text-blue-700">Medisetu</span></h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="signin-email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="signin-email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="m@example.com"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="signin-password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="signin-password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
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
                Logning in...
              </>
            ) : (
              `Login as ${role === "patient" ? "Patient" : "Doctor"}`
            )}
          </button>

          <p className="text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
              Create one now
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
