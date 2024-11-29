import FrontPage from "../components/FrontPage";
import { Spotlight } from "../components/ui/spotlight";

export default function Home() {
  return (
    <div className="w-screen">
      <Spotlight />
      <FrontPage />
    </div>
  );
}
