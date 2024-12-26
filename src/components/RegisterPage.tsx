"use client";

import React from "react";
import RegisterForm from "./RegisterForm"; // Assuming the path is correct

const RegisterPage = ({ role }: { role: string }) => {
  // Function to handle form submission
  const handleRegister = (formData: {
    name: string;
    email: string;
    password: string;
  }) => {
    console.log("Form Submitted with data:", formData);
  };

  return (
    <div className="mx-auto p-6 dark:bg-zinc-900 shadow rounded-lg min-w-[250px] max-w-[350px] w-full">
      <h1 className="text-2xl font-bold text-center mb-6">
        Register as {role}
      </h1>
      <RegisterForm onSubmit={handleRegister} />
    </div>
  );
};

export default RegisterPage;
