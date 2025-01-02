"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();
  useEffect(() => {
    async function init() {
      try {
        const token = localStorage.getItem("ORDER_ID");
        console.log(token);
        if (!token) {
          router.push("/payment-cancel?error=missing_token");
        }
        const response = await axios.post(`/api/verify-payment`, { token });
        localStorage.removeItem('ORDER_ID')
        if (response?.data?.url) {
          router.push(response.data.url);
        } else router.push(`/payment-cancel?error=payment_failed`);
      } catch (error) {
        console.log(error)
        router.push("/payment-cancel?error=something_went_wrong");
      }
    }
    init();
  }, [router]);
  return (
    <div className="flex h-screen w-screen text-white font-bold justify-center items-center bg-black">
      Verifying.... Just a second. Please do not stop the process
    </div>
  );
}
