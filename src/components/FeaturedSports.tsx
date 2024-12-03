import { div } from "framer-motion/client";
import sports_data from "../data/sports_data.json";
import { BackgroundGradientCards } from "./ui/BackgroundGradientCards";
import Link from "next/link";
export default function FeaturedSports() {
  interface Instructor {
    name: string;
    experience: string;
    specialization: string;
  }

  interface Sport {
    name: string;
    instructors: Instructor[];
    isFeatured: boolean;
    description: string;
    fee: number;
    achievements: string[];
    imageUrl: string;
  }

  // Extract the featured sports
  const featuredSports: Sport[] = Object.values(sports_data.sports).filter(
    (sport: Sport) => sport.isFeatured
  );
  return (
    <div className="bg-gray-900 pt-4 pb-10">
      <div className="text-center py-10">
        <h2 className="text-base text-teal-600 font-semibold tracking-wide uppercase">
          FEATURED COURSES
        </h2>
        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
          Learn With the Best
        </p>
      </div>
      <div className="mt-10 mx-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
          {featuredSports.map((sport: Sport) => (
            <div key={sport.name} className="flex justify-center">
              <BackgroundGradientCards
                key={sport.name}
                name={sport.name}
                description={sport.description}
                buttonContent="Explore"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="text-black text-xl flex justify-center items-center">
        <Link
          href={`/sports`}
          className="bg-white p-2 rounded-md hover:bg-gray-500 hover:text-white"
        >
          Explore all Sports
        </Link>
      </div>
    </div>
  );
}
