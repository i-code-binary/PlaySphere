import React from "react";
import sportsData from "../data/sports_data.json";
import { Data, Sport } from "./SportsPage";
import { CardSpotlight } from "./ui/CardSpotlight";
import { ShootingStars } from "./ui/ShootingStars";
import { StarsBackground } from "./ui/StarsBackground";
import { HoverBorderGradient } from "./ui/HoverBorderGradient";
import Link from "next/link";
import Footer from "./Footer";


export default function CustomSportsPage({ name }: { name: string }) {
  const obj = (sportsData as Data).sports;
  const sportsDetails: Sport = obj[name];
  const achievement: React.ReactNode = (
    <div className="max-w-2xl mx-auto p-6 bg-gray-900 shadow-xl rounded-lg">
      <h2 className="text-center text-3xl font-bold mb-8">Achievements</h2>
      <ul className="space-y-4">
        {sportsDetails.achievements.map((achievement, index) => (
          <li
            key={index}
            className="p-4 bg-gray-900 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
          >
            <p className="text-lg font-medium text-white">{achievement}</p>
          </li>
        ))}
      </ul>
    </div>
  );

  if (!sportsDetails)
    return (
      <div className="w-screen h-screen flex justify-center items-center bg-black text-white">
        <h2 className="font-bold text-xl">No such Course Offered Now</h2>
      </div>
    );
  return (
    <div className="bg-black text-white py-40 px-10">
      <StarsBackground />
      <ShootingStars />
      <div className="flex flex-col justify-center items-center">
        <h2 className="font-bold text-5xl text-center mb-10">
          {sportsDetails.name}
        </h2>
        <img
          src={sportsDetails.imageUrl}
          alt="Sport Image"
          width={1200} // You can specify width and height for optimization
          height={800}
          className="mx-auto w-screen 2xl:w-1/2 mb-10"
        />
        <div className="flex flex-col gap-10 mb-8">
          <p className="font-semibold text-xl text-gray-300">
            {sportsDetails.description}
          </p>
          <p className="font-medium text-lg">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Rem quis
            voluptate obcaecati dolor expedita sint aspernatur tempora tenetur
            id, aperiam voluptatibus quas fuga, dolores quaerat cumque, omnis
            quae illum dolorum. Minima laudantium libero ex, vero aut asperiores
            illo exercitationem rem illum sapiente natus non itaque, dolorum
            explicabo veritatis architecto iure quisquam debitis optio unde
            fuga. Quibusdam voluptatibus voluptate unde. Eos labore adipisci
            esse, hic nihil amet corporis eius repellat facilis fugit quisquam
            numquam illum. Iste placeat minima cum totam ab, repellat eveniet
            numquam corporis provident ut nesciunt ipsam, laborum incidunt nam
            accusantium veritatis dolore tempora dolorem vitae? Eveniet, fugit
            eaque!
          </p>
        </div>
        <div className="w-full">
          <CardSpotlight>{achievement}</CardSpotlight>
        </div>
        <div className="bg-gray-900 w-full py-8">
          <h4 className="font-semibold text-2xl text-center mb-10">
            Meet our Instructors
          </h4>
          <div className="flex gap-8 flex-wrap justify-center items-center">
            {sportsDetails.instructors.map((instructor, index) => (
              <CardSpotlight key={index}>
                {" "}
                <div className="max-w-md mx-auto p-4 bg-gray-900 rounded-lg shadow-lg">
                  <p className="text-xl font-semibold text-gray-700">
                    Name:{" "}
                    <span className="text-blue-500">{instructor.name}</span>
                  </p>
                  <p className="text-lg text-gray-600 mt-2">
                    Experience:{" "}
                    <span className="text-blue-500">
                      {instructor.experience}
                    </span>
                  </p>
                  <p className="text-lg text-gray-600 mt-2">
                    Specialization:{" "}
                    <span className="text-blue-500">
                      {instructor.specialization}
                    </span>
                  </p>
                </div>
              </CardSpotlight>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap justify-between bg-gray-600 w-full rounded-lg py-2 items-center px-8">
          <HoverBorderGradient>
            {" "}
            <div className="font-bold px-2 text-lg">
              Fee: {sportsDetails.fee}
            </div>
          </HoverBorderGradient>
          <HoverBorderGradient>
            {" "}
            <Link href={"/payment"} className="font-bold px-2 text-lg">
              Pay Now
            </Link>
          </HoverBorderGradient>
        </div>
      </div>
      <Footer />
    </div>
  );
}
