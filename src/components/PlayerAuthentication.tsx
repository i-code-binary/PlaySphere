"use client";
import Link from "next/link";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import { Advancedbutton } from "./ui/Advancedbutton";
import { useEffect, useState } from "react";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function PlayerAuthentication() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        router.push("/");
      }
    };
    // checkSession();
  }, []);
  const handleGoogleSignIn = async () => {
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      setError(error?.message || "Google sign-in failed");
      setTimeout(() => setError(null), 2000);
    }
  };
  return (
    <div className="flex justify-center items-center flex-col  text-white bg-black min-h-screen pt-40 w-screen">
      {error && <div className="text-red-600">{error}</div>}
      <div className="flex justify-center items-center w-screen p-4 gap-10 md:gap-0 flex-wrap lg:pt-0">
        <LoginPage role="Player" />
        <RegisterPage role="Player" />
      </div>
      <div className="flex flex-col items-center gap-4 mt-8">
        <Link href="/authentication/admin" passHref>
          <Advancedbutton content="Admin Registration"></Advancedbutton>
        </Link>

        {/* Google OAuth Button (You can integrate this with NextAuth.js later) */}
        <span onClick={handleGoogleSignIn}>
          <Advancedbutton content="Login with google"></Advancedbutton>
        </span>
      </div>
    </div>
  );
}
