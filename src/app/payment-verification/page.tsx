"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function Page() {
  const router = useRouter();
  const initCalled = useRef(false);

  useEffect(() => {
    async function init() {
      try {
        // Check if initialization was already called
        if (initCalled.current) return;
        initCalled.current = true;

        const token = localStorage.getItem("ORDER_ID");
        console.log(token);
        
        if (!token) {
          router.push("/payment-cancel?error=missing_token");
          return;
        }

        // Remove token before making the request to prevent race conditions
        localStorage.removeItem('ORDER_ID');
        
        const response = await axios.post(`/api/verify-payment`, { token });
        
        if (response?.data?.url) {
          router.push(response.data.url);
        } else {
          router.push(`/payment-cancel?error=payment_failed`);
        }
      } catch (error) {
        console.log(error);
        router.push("/payment-cancel?error=something_went_wrong");
      }
    }
    
    init();
  }, [router]);

  return (
    <div className="text-center p-4 flex justify-center items-center font-bold bg-black text-white h-screen w-screen">
      Verifying.... Just a second. Please do not stop the process
    </div>
  );
}