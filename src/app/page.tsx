import FeaturedSports from "@/components/FeaturedSports";
import FrontPage from "../components/FrontPage";
import { Spotlight } from "../components/ui/spotlight";
import Footer from "@/components/Footer";
import Features from "@/components/Features";
import { Metadata } from "next";
import OurTestimonials from "../components/OurTestimonials";

export const metadata: Metadata = {
  title: "Playsphere",
  description: "Where sports meet perfection",
};
export default function Home() {
  return (
    <div className="w-screen">
      <Spotlight />
      <FrontPage />
      <FeaturedSports />
      <Features />
      <OurTestimonials />
      <Footer />
    </div>
  );
}
