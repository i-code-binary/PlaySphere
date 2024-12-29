"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const PaymentCancelPage: React.FC = () => {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState<string>("Loading...");

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
};

export default PaymentCancelPage;
