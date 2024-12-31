"use client";

import { useSession } from "next-auth/react";
import PaymentForm from "./PaymentForm";
import { StarsBackground } from "./ui/StarsBackground";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PaymentPage() {
  const { data: session } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (!session || !session.user) router.push("/authentication");
  }, []);
  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <PaymentForm />
      <StarsBackground />
    </div>
  );
}
