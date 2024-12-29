"use client";
import React, { useState } from "react";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { useRouter } from "next/navigation";
import axios from "axios";
import sportsdata from "../data/sports_data.json";

interface FormData {
  amount: string;
  currency: string;
  sports: string;
  month: string;
}

interface PayPalLink {
  href: string;
  rel: string;
  method: string;
}

interface PayPalOrderResponse {
  orderDetails: {
    id: string;
    links: PayPalLink[];
  };
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  message: string;
  status: number;
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
const currencies = ["USD"] as const;

const PaymentForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    amount: "",
    currency: "USD",
    sports: "",
    month: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const router = useRouter();

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

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setStatus(null);

    const { amount, currency, sports, month } = formData;

    if (!amount || !sports || !month) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      const response = await axios.post<PayPalOrderResponse>(
        "/api/user/verify",
        {
          amount,
          currency,
          sports,
          month,
        }
      );

      if (response.data.orderDetails) {
        const approvalLink = response.data.orderDetails.links.find(
          (link) => link.rel === "approve"
        )?.href;

        if (approvalLink) {
          window.location.href = approvalLink;
        } else {
          setError("PayPal approval link not found");
        }
      } else {
        setError("Invalid response from server");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            "An error occurred while initiating payment"
        );
      } else {
        setError("An unexpected error occurred");
      }
      setTimeout(() => setError(null), 3000);
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

      <div>
        <Label htmlFor="currency">Currency</Label>
        <select
          id="currency"
          name="currency"
          value={formData.currency}
          onChange={handleChange}
          className="w-full bg-gray-50 dark:bg-zinc-800 text-black dark:text-white rounded-md px-3 py-2 text-sm"
          disabled={isLoading}
        >
          {currencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
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
