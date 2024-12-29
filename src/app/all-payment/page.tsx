"use client";

import { StarsBackground } from "@/components/ui/StarsBackground";
import axios from "axios";
import { useState, useEffect } from "react";

interface Payment {
  id: string;
  user: {
    name: string;
    email: string;
  };
  amount: number;
  currency: string;
  sports: string;
  month: string;
  paypalOrderId: string;
  status: string;
  paymentMethod: string;
  createdAt: string;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/get-payment");
        setPayments(response.data.payments); // Note: lowercase 'payments'
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch payments."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="pt-36 bg-black text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center">All Payments</h1>
      {error ? (
        <div className="text-red-500 mb-4">{error}</div>
      ) : payments.length === 0 ? (
        <div className="text-gray-500">No payments found.</div>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">User</th>
              <th className="border border-gray-300 px-4 py-2">Amount</th>
              <th className="border border-gray-300 px-4 py-2">Currency</th>
              <th className="border border-gray-300 px-4 py-2">Sports</th>
              <th className="border border-gray-300 px-4 py-2">Month</th>
              <th className="border border-gray-300 px-4 py-2">
                Payment Method
              </th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td className="border border-gray-300 px-4 py-2">
                  {payment.id}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {payment.user.name} ({payment.user.email})
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {payment.amount.toFixed(2)}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {payment.currency}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {payment.sports}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {payment.month}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {payment.paymentMethod}
                </td>
                <td
                  className={`border border-gray-300 px-4 py-2 ${
                    payment.status === "PENDING"
                      ? "text-yellow-500"
                      : payment.status === "COMPLETED"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {payment.status}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(payment.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
