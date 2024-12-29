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
          router.push(
            `/payment-cancel?error=${response.data.message} || "Payment Verification Failed.Contact official Team`
          );
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          if (error.response) {
            router.push(
              `/payment-cancel?error=${
                error.response.data?.error ||
                "Payment Verification Failed. Contact official Team"
              }`
            );
          } else {
            router.push(
              `/payment-cancel?error="Error: Unable to reach payment verification service."`
            );
          }
        } else {
          router.push(
            `/payment-cancel?error="Unexpected error occurred. Please try again later."`
          );
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
      className={`${loading ? "text-white" : "text-green-500"}`}
    >
      {loading ? "Loading..." : message}
    </div>
  );
}
