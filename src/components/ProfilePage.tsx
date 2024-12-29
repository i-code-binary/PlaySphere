"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, signOut } from "next-auth/react";
import axios from "axios";
import Link from "next/link";
export enum Role {
  USER = "USER",
  ADMIN = "ADMIN"
}
interface Payment {
  id: string;
  amount: number;
  createdAt: string;
  sports: string;
}

interface UserData {
  email: string;
  name: string;
  role: Role;
  id: string;
  payments: Payment[];
}

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const checkSessionAndFetchData = async () => {
      const session = await getSession();

      if (!session?.user?.email) {
        router.push("/authentication");
        return;
      }

      const token = localStorage.getItem("token");

      try {
        const { data } = await axios.get("/api/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          router.push("/authentication");
        }
      } finally {
        setLoading(false);
      }
    };

    checkSessionAndFetchData();
  }, [router]);

  const handleLogout = async () => {
    setLoading(true);
    try {
      localStorage.removeItem("token");
      sessionStorage.clear();
      await signOut({
        callbackUrl: "/authentication",
        redirect: false,
      });
      router.push("/authentication");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        Loading...
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        Unable to fetch user details.
        <button
          onClick={handleLogout}
          className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-28 mx-4"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <div className="backdrop-blur-md bg-white/20 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Profile Details</h1>
        <p className="mb-2">
          <strong>Name:</strong> {userData.name}
        </p>
        <p className="mb-2">
          <strong>Email:</strong> {userData.email}
        </p>
        <p className="mb-2">
          <strong>Role:</strong> {userData.role}
        </p>
        <p className="mb-2">
          <strong>ID:</strong> {userData.id}
        </p>

        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Payments:</h2>
          {userData.payments.length > 0 ? (
            <ul className="space-y-2">
              {userData.payments.map((payment) => (
                <li
                  key={payment.id}
                  className="bg-gray-700 text-white p-2 rounded-md"
                >
                  <p>
                    <strong>ID:</strong> ${payment.id}
                  </p>
                  <p>
                    <strong>Amount:</strong> ${payment.amount}
                  </p>
                  <p>
                    <strong>sports:</strong> {payment.sports}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {payment.createdAt ? (
                      <span>
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </span>
                    ) : (
                      <span>No date available</span>
                    )}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-300">No payments available.</p>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full"
        >
          Logout
        </button>
      </div>
      {userData.role === Role.ADMIN && (
  <Link 
    href="/all-payment"
    className="mt-4 backdrop-blur-md bg-white/20 hover:bg-white/30 
              text-white font-bold py-2 px-6 rounded-lg 
              transition-all duration-200 flex items-center gap-2"
  >
    <svg 
      className="w-5 h-5" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
      <line x1="2" y1="10" x2="22" y2="10"/>
    </svg>
   Payment Dashboard
  </Link>
)}
    </div>
  );
}
