import SportsPage from "@/components/SportsPage";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "All Sports",
  description: "Explore all the Sports Courses",
};
export default function Sports() {
  return (
    <div>
      <SportsPage />
    </div>
  );
}
