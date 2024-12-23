import React from "react";
import { InfiniteMovingCards } from "./ui/InfiniteMovingCards";
import { BackgroundBoxes } from "./ui/BackgroundeBoxes";

const testimonials = [
  {
    quote:
      "PlaySphere has completely transformed my gaming experience! The community is vibrant, and the features are top-notch.",
    name: "John Doe",
    title: "Professional Gamer",
  },
  {
    quote:
      "I love the intuitive interface and seamless integration of all my favorite games. It's the perfect platform for gamers like me.",
    name: "Jane Smith",
    title: "Content Creator",
  },
  {
    quote:
      "Thanks to PlaySphere, I've met amazing people and participated in exciting tournaments. The experience is unparalleled.",
    name: "Samuel Lee",
    title: "Amateur Esports Player",
  },
  {
    quote:
      "The customer support team at PlaySphere is phenomenal. They always go the extra mile to ensure a smooth experience.",
    name: "Emily Johnson",
    title: "Casual Gamer",
  },
  {
    quote:
      "I never knew how much I needed PlaySphere until I started using it. The personalized recommendations and easy navigation are fantastic!",
    name: "Michael Brown",
    title: "Esports Enthusiast",
  },
  {
    quote:
      "PlaySphere's game library is amazing! I can always find something new to play, and the community discussions are great for strategy tips.",
    name: "Sophia Miller",
    title: "Gamer & Streamer",
  },
];

export default function OurTestimonials() {
  return (
    <div
      // style={{ background: "rgb(12 8 18)" }}
      className="h-[35rem] bg-black w-full dark:bg-grid-white/[0.2] relative flex flex-col items-center justify-center overflow-hidden gap-7"
    >
      <BackgroundBoxes/>
      <h2 className="text-3xl font-bold text-center mb-3 z-10 text-white">
        Our Testimonials
      </h2>
      <div className="flex justify-center w-full overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl">
          <InfiniteMovingCards
            items={testimonials}
            direction="right"
            speed="normal"
          />
        </div>
      </div>
    </div>
  );
}
