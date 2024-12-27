"use client";

import React, { useEffect, useState } from "react";
import { getSession, signIn } from "next-auth/react";
import LoginForm from "./LoginForm"; // Adjust the import path as needed
import { useRouter } from "next/navigation";

export default function LoginPage({ role }: { role: string }) {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();


  const handleLogin = async (formData: { email: string; password: string }) => {
    setError(null);
    const res = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    if (res?.error) {
      setError("Unsuccessful login attempt");
      setTimeout(() => setError(null), 2000);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="mx-auto p-6 dark:bg-zinc-900 shadow rounded-lg min-w-[250px] max-w-[300px] w-full">
      <h1 className="text-2xl font-bold text-center mb-6">Login as {role}</h1>
      {/* Display error message here (if any) */}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <LoginForm onSubmit={handleLogin} /> {/* Pass form handler */}
    </div>
  );
}
