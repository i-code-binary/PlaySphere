"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("");

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      setMessage(error);
    } else {
      setMessage("Payment failed.");
    }
  }, [searchParams]);

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
      className="text-red-700 w-screen"
    >
      {message}
    </div>
  );
}
