"use client";
import React from "react";
import { BackgroundGradient } from "../ui/BackgroundGradient";
import Image from "next/image";
import Link from "next/link";

export function BackgroundGradientCards({
  image,
  name,
  description,
  buttonContent,
}: {
  image?: string;
  name: string;
  description: string;
  buttonContent: string;
}) {
  return (
    <div>
      <BackgroundGradient className="rounded-[22px] max-w-md p-4 sm:p-10 bg-white dark:bg-zinc-900">
        {image && (
          <Image
            src={`/jordans.webp`}
            alt="jordans"
            height="400"
            width="400"
            className="object-contain"
          />
        )}
        <p className="text-center font-semibold sm:text-xl text-black mt-2 mb-3 dark:text-neutral-200 text-lg">
          {name}
        </p>

        <p className="text-md text-neutral-600 dark:text-neutral-400 text-center">
          {description}
        </p>
        <Link
          href={`/sports/${name}`}
          className="flex justify-center items-center"
        >
          <button className="rounded-md py-2 mt-5 px-4 text-black flex items-center space-x-1 bg-white text-xs font-bold">
            <span>{buttonContent} </span>
          </button>
        </Link>
      </BackgroundGradient>
    </div>
  );
}
