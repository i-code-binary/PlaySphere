import FeaturedSports from "@/components/FeaturedSports";
import FrontPage from "../components/FrontPage";
import { Spotlight } from "../components/ui/spotlight";
import Footer from "@/components/Footer";
import Features from "@/components/Features";

export default function Home() {
  return (
    <div className="w-screen">
      <Spotlight />
      <FrontPage />
      <FeaturedSports />
      <Features />
      <Footer />
    </div>
  );
}
