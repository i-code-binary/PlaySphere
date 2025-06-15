"use client";

import axios, { AxiosError } from "axios";
import { useState, useEffect } from "react";

interface Query {
  id: string;
  name: string;
  email: string;
  query: string;
  createdAt: string;
}

interface FilterState {
  email: string;
  name: string;
  startDate: string;
  endDate: string;
}

interface SortState {
  field: "name" | "email" | "createdAt";
  direction: "asc" | "desc";
}

export default function AllQueriesPage() {
  const [queries, setQueries] = useState<Query[]>([]);
  const [filteredQueries, setFilteredQueries] = useState<Query[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    email: "",
    name: "",
    startDate: "",
    endDate: "",
  });
  const [sort, setSort] = useState<SortState>({
    field: "createdAt",
    direction: "desc",
  });

  // Apply filters and sorting
  const applyFiltersAndSort = () => {
    let filtered = queries;

    // Apply filters
    if (filters.email) {
      filtered = filtered.filter((query) =>
        query.email.toLowerCase().includes(filters.email.toLowerCase())
      );
    }

    if (filters.name) {
      filtered = filtered.filter((query) =>
        query.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    // Date range filter
    if (filters.startDate || filters.endDate) {
      filtered = filtered.filter((query) => {
        const queryDate = new Date(query.createdAt);
        const startDate = filters.startDate
          ? new Date(filters.startDate)
          : null;
        const endDate = filters.endDate
          ? new Date(filters.endDate + "T23:59:59")
          : null;

        if (startDate && endDate) {
          return queryDate >= startDate && queryDate <= endDate;
        } else if (startDate) {
          return queryDate >= startDate;
        } else if (endDate) {
          return queryDate <= endDate;
        }
        return true;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: string | Date;
      let bValue: string | Date;

      if (sort.field === "createdAt") {
        aValue = new Date(a[sort.field]);
        bValue = new Date(b[sort.field]);
      } else {
        aValue = a[sort.field].toLowerCase();
        bValue = b[sort.field].toLowerCase();
      }

      if (aValue < bValue) {
        return sort.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sort.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setFilteredQueries(filtered);
  };

  // Handle filter changes
  const handleFilterChange = (filterType: keyof FilterState, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  // Handle sort changes
  const handleSortChange = (field: SortState["field"]) => {
    setSort((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      email: "",
      name: "",
      startDate: "",
      endDate: "",
    });
  };

  // Get sort icon
  const getSortIcon = (field: SortState["field"]) => {
    if (sort.field !== field) return "↕️";
    return sort.direction === "asc" ? "↑" : "↓";
  };

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/contact");
        setQueries(response.data.data);
        setFilteredQueries(response.data.data);
      } catch (err: unknown) {
        if (err instanceof AxiosError)
          setError(err.response?.data?.message || "Failed to fetch queries.");
        else if (err instanceof Error) {
          setError(err.message || "Failed to fetch queries.");
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

    fetchQueries();
  }, []);

  // Apply filters and sorting whenever filters, sort, or queries change
  useEffect(() => {
    applyFiltersAndSort();
  }, [filters, sort, queries]);

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="pt-36 bg-black text-white min-h-screen px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">All Queries</h1>

      {/* Filter Section */}
      <div className="mb-6 p-4 bg-gray-900 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Name Filter */}
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              placeholder="Search by name..."
              value={filters.name}
              onChange={(e) => handleFilterChange("name", e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email Filter */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="text"
              placeholder="Search by email..."
              value={filters.email}
              onChange={(e) => handleFilterChange("email", e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
            Showing {filteredQueries.length} of {queries.length} queries
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="text-red-500 mb-4 p-3 bg-red-900/20 border border-red-500 rounded-md">
          {error}
        </div>
      )}

      {/* Queries Table */}
      {queries.length === 0 ? (
        <div className="text-gray-500 text-center">No queries found.</div>
      ) : filteredQueries.length === 0 ? (
        <div className="text-gray-500 text-center">
          No queries match the current filters.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-black">
                <th className="border border-gray-300 px-4 py-2">ID</th>
                <th
                  className="border border-gray-300 px-4 py-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSortChange("name")}
                >
                  Name {getSortIcon("name")}
                </th>
                <th
                  className="border border-gray-300 px-4 py-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSortChange("email")}
                >
                  Email {getSortIcon("email")}
                </th>
                <th className="border border-gray-300 px-4 py-2">Query</th>
                <th
                  className="border border-gray-300 px-4 py-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSortChange("createdAt")}
                >
                  Date {getSortIcon("createdAt")}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredQueries.map((query) => (
                <tr key={query.id}>
                  <td className="border border-gray-300 px-4 py-2">
                    {query.id}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {query.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {query.email}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 max-w-md">
                    <div className="truncate" title={query.query}>
                      {query.query.length > 100
                        ? `${query.query.slice(0, 100)}...`
                        : query.query}
                    </div>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(query.createdAt).toLocaleDateString()}
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
