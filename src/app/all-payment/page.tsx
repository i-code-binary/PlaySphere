"use client";

import axios, { AxiosError } from "axios";
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
  paypalOrderId: string; // This is actually Cashfree Order ID
  paypalPayerId: string; // This is actually Transaction ID
  status: string;
  paymentMethod: string;
  createdAt: string;
}

interface FilterState {
  email: string;
  sports: string;
  month: string;
  status: string;
  startDate: string;
  endDate: string;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    email: "",
    sports: "",
    month: "",
    status: "",
    startDate: "",
    endDate: "",
  });

  // Get unique values for filter dropdowns
  const getUniqueValues = (key: keyof Payment | "email") => {
    if (key === "email") {
      return [...new Set(payments.map((payment) => payment.user.email))].sort();
    }
    return [
      ...new Set(payments.map((payment) => payment[key] as string)),
    ].sort();
  };

  // Filter payments based on current filter state
  const applyFilters = () => {
    let filtered = payments;

    if (filters.email) {
      filtered = filtered.filter((payment) =>
        payment.user.email.toLowerCase().includes(filters.email.toLowerCase())
      );
    }

    if (filters.sports) {
      filtered = filtered.filter(
        (payment) => payment.sports === filters.sports
      );
    }

    if (filters.month) {
      filtered = filtered.filter((payment) => payment.month === filters.month);
    }

    if (filters.status) {
      filtered = filtered.filter(
        (payment) => payment.status === filters.status
      );
    }

    // Date range filter
    if (filters.startDate || filters.endDate) {
      filtered = filtered.filter((payment) => {
        const paymentDate = new Date(payment.createdAt);
        const startDate = filters.startDate
          ? new Date(filters.startDate)
          : null;
        const endDate = filters.endDate
          ? new Date(filters.endDate + "T23:59:59")
          : null;

        if (startDate && endDate) {
          return paymentDate >= startDate && paymentDate <= endDate;
        } else if (startDate) {
          return paymentDate >= startDate;
        } else if (endDate) {
          return paymentDate <= endDate;
        }
        return true;
      });
    }

    setFilteredPayments(filtered);
  };

  // Handle filter changes
  const handleFilterChange = (filterType: keyof FilterState, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      email: "",
      sports: "",
      month: "",
      status: "",
      startDate: "",
      endDate: "",
    });
  };

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/get-payment");
        setPayments(response.data.payments);
        setFilteredPayments(response.data.payments);
      } catch (err: unknown) {
        if (err instanceof AxiosError)
          setError(err.response?.data?.message || "Failed to fetch payments.");
        else if (err instanceof Error) {
          setError(err.message || "Failed to fetch payments.");
        } else {
          setError("An unknown error occurred.");
        }
        setTimeout(() => {
          setError(null);
        }, 2000);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, []);

  // Apply filters whenever filters or payments change
  useEffect(() => {
    applyFilters();
  }, [filters, payments]);

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="pt-36 bg-black text-white min-h-screen px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">All Payments</h1>

      {/* Filter Section */}
      <div className="mb-6 p-4 bg-gray-900 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
          {/* Email Filter */}
          <div>
            <label className="block text-sm font-medium mb-1">User Email</label>
            <input
              type="text"
              placeholder="Search by email..."
              value={filters.email}
              onChange={(e) => handleFilterChange("email", e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Sports Filter */}
          <div>
            <label className="block text-sm font-medium mb-1">Sports</label>
            <select
              value={filters.sports}
              onChange={(e) => handleFilterChange("sports", e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Sports</option>
              {getUniqueValues("sports").map((sport) => (
                <option key={sport} value={sport}>
                  {sport}
                </option>
              ))}
            </select>
          </div>

          {/* Month Filter */}
          <div>
            <label className="block text-sm font-medium mb-1">Month</label>
            <select
              value={filters.month}
              onChange={(e) => handleFilterChange("month", e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Months</option>
              {getUniqueValues("month").map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              {getUniqueValues("status").map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date Filter */}
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* End Date Filter */}
          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Filter Actions */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md text-sm font-medium transition-colors"
          >
            Clear Filters
          </button>
          <div className="text-sm text-gray-400 flex items-center">
            Showing {filteredPayments.length} of {payments.length} payments
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="text-red-500 mb-4 p-3 bg-red-900/20 border border-red-500 rounded-md">
          {error}
        </div>
      )}

      {/* Payments Table */}
      {payments.length === 0 ? (
        <div className="text-gray-500 text-center">No payments found.</div>
      ) : filteredPayments.length === 0 ? (
        <div className="text-gray-500 text-center">
          No payments match the current filters.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-black">
                <th className="border border-gray-300 px-4 py-2">ID</th>
                <th className="border border-gray-300 px-4 py-2">User</th>
                <th className="border border-gray-300 px-4 py-2">
                  Amount(INR)
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  Transaction ID
                </th>
                <th className="border border-gray-300 px-4 py-2">Sports</th>
                <th className="border border-gray-300 px-4 py-2">Month</th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
                <th className="border border-gray-300 px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
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
                    {payment.paypalPayerId}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                      {payment.sports}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {payment.month}
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
        </div>
      )}
    </div>
  );
}
