"use client";

import PaymentForm from "./PaymentForm";
import { StarsBackground } from "./ui/StarsBackground";

export default function PaymentPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <PaymentForm />
      <StarsBackground />
    </div>
  );
}
