import Link from "next/link";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import { Advancedbutton } from "./ui/Advancedbutton";

export default function AdminAuthentication() {
  return (
    <div className="flex justify-center items-center flex-col  text-white bg-black min-h-screen pt-40 w-screen">
      <div className="flex justify-center items-center w-screen p-4 gap-10 md:gap-0 flex-wrap lg:pt-0">
        <RegisterPage role="Admin" />
      </div>
      <div className="flex flex-col items-center gap-4 mt-8">
        <Link href="/authentication" passHref>
          <Advancedbutton content="Player Page"></Advancedbutton>
        </Link>
      </div>
    </div>
  );
}
