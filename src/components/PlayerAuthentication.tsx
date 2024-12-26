import Link from "next/link";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import { Advancedbutton } from "./ui/Advancedbutton";

export default function PlayerAuthentication() {
  return (
    <div className="flex justify-center items-center flex-col  text-white bg-black min-h-screen pt-40 w-screen">
      <div className="flex justify-center items-center w-screen p-4 gap-10 md:gap-0 flex-wrap lg:pt-0">
        {/* Login and Register components for Player */}
        <LoginPage role="Player" />
        <RegisterPage role="Player" />
      </div>
      {/* Additional Options */}
      <div className="flex flex-col items-center gap-4 mt-8">
        {/* Go to Admin Page */}
        <Link href="/admin-login" passHref>
          <Advancedbutton content="Admin Page"></Advancedbutton>
        </Link>

        {/* Google OAuth Button (You can integrate this with NextAuth.js later) */}
        <Advancedbutton content="Login with google"></Advancedbutton>
      </div>
    </div>
  );
}
