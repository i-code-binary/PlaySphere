"use client";
import React from "react";
import { HoverBorderGradient } from "./HoverBorderGradient";

export function Advancedbutton({ content }: { content: string }) {
  return (
    <div className="flex justify-center text-center">
      <HoverBorderGradient
        containerClassName="rounded-full"
        as="button"
        className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
      >
        <span>{content}</span>
      </HoverBorderGradient>
    </div>
  );
}
