"use client";
import PaymentPage from "@/components/PaymentPage";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();
  useEffect(() => {
    async function checkUserLogin() {
      const session = await getSession();
      if (!session) router.push("/authentication");
    }
    checkUserLogin();
  }, [router]);
  return (
    <div>
      <PaymentPage />
    </div>
  );
}
