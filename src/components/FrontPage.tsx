import { Advancedbutton } from "./ui/Advancedbutton";
import Link from "next/link";
export default function FrontPage() {
  return (
    <div className="w-screen min-h-screen flex flex-col justify-center items-center text-white gap-12 bg-black">
      <h1 className="text-6xl font-bold text-center">Discover. Play. Conquer. Repeat.</h1>
      <div className="w-1/3 text-center">
        <p className="text-xl">
          Experience gaming like never before! From action-packed tournaments to
          casual fun, Playsphere is your gateway to unforgettable moments.
        </p>
      </div>
      <Link href="/sports">
        <Advancedbutton content={"Explore Sports"} />
      </Link>
    </div>
  );
}
