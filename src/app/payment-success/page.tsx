"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setMessage("Error: Missing payment token.");
      setLoading(false);
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await axios.get(`/api/verify-payment`, {
          params: { token },
        });

        if (response.status === 201) {
          setMessage(response.data.message || "Payment verified successfully!");
        } else {
          setMessage(response.data.message || "Payment verification failed.");
        }
      } catch (error: any) {
        if (error.response) {
          // If server responded with an error status
          setMessage(
            `Error: ${
              error.response.data?.error || "Payment verification failed"
            }`
          );
        } else {
          // If request fails or network error occurs
          setMessage("Error: Unable to reach payment verification service.");
        }
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
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
    >
      {loading ? "Loading..." : message}
    </div>
  );
}
