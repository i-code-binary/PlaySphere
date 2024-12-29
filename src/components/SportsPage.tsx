"use client";
import React from "react";
import sportsData from "../data/sports_data.json";
import { CardContainer, CardBody, CardItem } from "./ui/Card3D";
import { Button } from "./ui/MovingBorder";
import Link from "next/link";
export interface Instructor {
  name: string;
  experience: string;
  specialization: string;
}

export interface Sport {
  name: string;
  instructors: Instructor[];
  isFeatured: boolean;
  description: string;
  fee: number;
  achievements: string[];
  imageUrl: string;
}

export interface Data {
  sports: { [key: string]: Sport };
}

export default function SportsPage() {
  const AllSports: Sport[] = Object.values((sportsData as Data).sports);

  return (
    <div className="bg-black text-white min-h-screen px-6 py-40">
      <h1 className="text-center text-4xl font-bold mb-8">All Sports</h1>
      <div
        className="grid gap-10 grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 px-4 mx-8"
        style={{ justifyItems: "center" }}
      >
        {AllSports.map((sport) => (
          <CardContainer
            key={sport.name}
            className="rounded-lg shadow-lg bg-black border-gray-500 border-solid border-2 text-white"
          >
            <CardBody className="flex flex-col items-center p-6">
              {/* Sport Image */}
              <CardItem
                className="rounded-md overflow-hidden w-full"
                translateZ={30}
              >
                <img
                  src={sport.imageUrl}
                  alt={sport.name}
                  className="w-full h-48 object-cover"
                />
              </CardItem>

              {/* Sport Details */}
              <CardItem
                className="mt-4 text-center flex flex-col gap-3"
                translateZ={10}
              >
                <h3 className="text-2xl font-bold text-left">{sport.name}</h3>
                <p className="text-sm mt-2 text-gray-400 text-left">
                  {sport.description}
                </p>

                <Link href={`/sports/${sport.name}`}>
                  <Button
                    containerClassName="hover:shadow-lg mx-auto"
                    duration={3000}
                    className="font-semibold"
                  >
                    Click Me
                  </Button>
                </Link>
              </CardItem>
            </CardBody>
          </CardContainer>
        ))}
      </div>
    </div>
  );
}
