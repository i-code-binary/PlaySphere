"use client";

import React from "react";
import LoginForm from "./LoginForm"; // Adjust the import path as needed

export default function LoginPage({ role }: { role: string }) {
  const handleLogin = (formData: { email: string; password: string }) => {
    console.log("Login Data:", formData);
  };

  return (
    <div className="mx-auto p-6 dark:bg-zinc-900 shadow rounded-lg min-w-[250px] max-w-[300px] w-full">
      <h1 className="text-2xl font-bold text-center mb-6">Login as {role}</h1>
      <LoginForm onSubmit={handleLogin} />
    </div>
  );
}
