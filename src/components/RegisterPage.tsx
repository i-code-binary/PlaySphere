"use client";

import React, { useState } from "react";
import RegisterForm from "./RegisterForm"; // Assuming the path is correct
import axios from "axios";

const RegisterPage = ({ role }: { role: string }) => {
  const [adminPass, setAdminPass] = useState(""); // State for adminPass
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for error messages

  // Function to handle form submission
  const handleRegister = async (formData: {
    name: string;
    email: string;
    password: string;
  }) => {
    console.log("Form Submitted with data:", formData);
    setErrorMessage(null);
    try {
      const { name, email, password } = formData;

      if (role === "Admin") {
        if (!adminPass) {
          setErrorMessage("Admin Pass is required for Admin registration.");
          setTimeout(() => setErrorMessage(null), 1000);
          return;
        }
        const response = await axios.post(`/api/auth/email`, {
          name,
          email,
          password,
          role: "ADMIN",
          adminPass,
        });

        console.log("Admin Registered Successfully:", response.data);
      } else {
        const response = await axios.post(`/api/auth/email`, {
          name,
          email,
          password,
          role: "USER",
        });

        console.log("User Registered Successfully:", response.data);
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Something went wrong.";
      setErrorMessage(errorMsg);
      setTimeout(() => setErrorMessage(null), 1000);
    }
  };

  return (
    <div className="mx-auto p-6 dark:bg-zinc-900 shadow rounded-lg min-w-[250px] max-w-[350px] w-full">
      <h1 className="text-2xl font-bold text-center mb-6">
        Register as {role}
      </h1>

      {errorMessage && (
        <div className="bg-red-500 text-white text-center p-2 rounded mb-4">
          {errorMessage}
        </div>
      )}
      {role === "Admin" && (
        <div className="mt-4">
          <label
            htmlFor="adminPass"
            className="block text-sm font-medium text-gray-200 mb-2"
          >
            Admin Pass
          </label>
          <input
            type="password"
            id="adminPass"
            value={adminPass}
            onChange={(e) => setAdminPass(e.target.value)}
            placeholder="Enter Admin Pass"
            className="block w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-zinc-800 dark:text-white"
          />
        </div>
      )}
      <RegisterForm onSubmit={handleRegister} />
    </div>
  );
};

export default RegisterPage;
