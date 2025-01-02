"use client";
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from "react";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import axios from "axios";
import sportsdata from "../data/sports_data.json";
import { load } from "@cashfreepayments/cashfree-js";
import { useRouter } from "next/navigation";

interface FormData {
  amount: string;
  sports: string;
  month: string;
}

const sportsOptions = [
  "CRICKET",
  "FOOTBALL",
  "BASKETBALL",
  "TENNIS",
  "BADMINTON",
  "SWIMMING",
] as const;
const monthOptions = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;


const PaymentForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    amount: "",
    sports: "",
    month: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  useEffect(() => {
    const initializeSDK = async () => {
      try {
        await load({ mode: "sandbox" });
        console.log("Cashfree SDK loaded successfully");
      } catch (error) {
        console.log("Error connecting to Cashfree SDK", error);
        setError("Failed to initialize payment gateway. Please refresh");
      }
    };
    initializeSDK();
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    if (name === "sports") {
      const data = sportsdata.sports;
      const matchingKey = Object.keys(data).find(
        (key) => key.toLowerCase() === value.toLowerCase()
      );

      if (!matchingKey) {
        setError("Invalid Sports");
        setTimeout(() => setError(null), 3000);
        return;
      }

      const fee = data[matchingKey as keyof typeof data].fee.toString();
      setFormData((prev) => ({
        ...prev,
        sports: value,
        amount: fee,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  async function initiatePayment(paymentSessionId: string) {
    try {
      const cashfree = await load({ mode: "sandbox" });
      const checkoutOptions = {
        paymentSessionId: paymentSessionId,
        redirectTarget: "_modal",
      };
      
      const result: any = await cashfree.checkout(checkoutOptions);
      if (result.error) {
        setError(`${result.error}` || "Payment failed");
        console.log(
          "User has closed the popup or there is some payment error, Check for Payment Status"
        );
        console.log(result.error);
        router.push("/payment-cancel?error=payment_failed");
      }
    } catch (error) {
      console.log("Error initiating payment", error);
      router.push("/payment-cancel?error=payment_initiation_failed");
    }
  }

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setStatus(null);

    const { amount, sports, month } = formData;

    if (!amount || !sports || !month) {
      setError("Please fill all required fields.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/create-order", {
        amount,
        sports,
        month,
      });

      if (response.status !== 200) {
        alert("Error creating payment order. Please try again.");
        return;
      }
      const paymentSessionId = response.data.sessionId;
      const orderid = response.data.orderId;
       localStorage.setItem("SESSION_ID", paymentSessionId);
      localStorage.setItem("ORDER_ID", orderid);
      if (!paymentSessionId || !orderid) {
        setError("Failed to create Payment Order");
        setLoading(false);
        setTimeout(() => {
          setError(null);
        }, 2000);
        return;
      }
      await initiatePayment(paymentSessionId);
      router.push('/payment-verification')
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            "An error occurred while initiating payment"
        );
        router.push(`/payment-verification`)
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-[450px] mx-auto bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg space-y-4 z-20"
    >
      <h1 className="text-2xl font-bold mb-4 text-center text-black dark:text-white">
        Payment Form
      </h1>

      {error && <div className="text-red-500 text-sm">{error}</div>}
      {status && <div className="text-blue-500 text-sm">{status}</div>}

      <div>
        <Label htmlFor="sports">Sport</Label>
        <select
          id="sports"
          name="sports"
          value={formData.sports}
          onChange={handleChange}
          required
          disabled={isLoading}
          className="w-full bg-gray-50 dark:bg-zinc-800 text-black dark:text-white rounded-md px-3 py-2 text-sm"
        >
          <option value="" disabled>
            Select a sport
          </option>
          {sportsOptions.map((sport) => (
            <option key={sport} value={sport}>
              {sport}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="month">Month</Label>
        <select
          id="month"
          name="month"
          value={formData.month}
          onChange={handleChange}
          required
          disabled={isLoading}
          className="w-full bg-gray-50 dark:bg-zinc-800 text-black dark:text-white rounded-md px-3 py-2 text-sm"
        >
          <option value="" disabled>
            Select a month
          </option>
          {monthOptions.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          min="1"
          value={formData.amount}
          onChange={handleChange}
          required
          disabled
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
        disabled={isLoading}
      >
        {isLoading ? "Processing" : "Proceed to Pay"}
      </button>
    </form>
  );
};

export default PaymentForm;
