"use client";
import { StarsBackground } from "@/components/ui/StarsBackground";
import axios from "axios";
import { useState } from "react";
import { json } from "stream/consumers";

interface FormData {
  name: string;
  email: string;
  query: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    query: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post(`/api/contact`, {
        email: formData.email,
        query: formData.query,
        name: formData.name,
      });
      if (response.data.status != 201) {
        setError(`${response.data.message}` || "Failed to raise query");
        setTimeout(() => {
          setError(null);
        }, 2000);
        return;
      }
      setSuccess(true);
      setFormData({ name: "", email: "", query: "" }); // Reset the form
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setTimeout(() => {
        setError(null);
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <StarsBackground />
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-6 bg-gray-700/40 rounded-lg shadow-md z-20"
      >
        <h2 className="text-2xl font-semibold text-center mb-4">Contact Us</h2>
        {error && <p className="text-red-500 mb-3">{error}</p>}
        {success && (
          <p className="text-green-500 mb-3">Form submitted successfully!</p>
        )}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="query">
            Query
          </label>
          <textarea
            id="query"
            name="query"
            value={formData.query}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            rows={4}
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className={`w-full px-4 py-2 text-white ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } rounded`}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
