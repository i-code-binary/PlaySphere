"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("Loading...");
  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setMessage("Error: Missing payment token.");
      setLoading(false);
      return;
    } else {
      setLoading(false);
      setMessage(token);
    }
  }, [searchParams, router]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "black",
        color: "white",
        fontSize: "1.5rem",
        textAlign: "center",
      }}
      className={loading ? "text-white" : "text-green-500"}
    >
      {loading ? "Loading..." : message}
    </div>
  );
}
