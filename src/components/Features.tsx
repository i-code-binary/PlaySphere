import { StickyScroll } from "./ui/stickyScrollReveal";
import feature1 from "../assets/feature1.webp";
import feature2 from "../assets/feature2.webp";
import feature3 from "../assets/feature3.webp";
import feature5 from "../assets/feature5.webp";
import feature6 from "../assets/feature6.webp";
const playsphereContent = [
  {
    title: "Unlock Your Athletic Potential",
    description:
      "Embark on a personalized training journey with PlaySphere. Our expert coaches tailor programs to your unique strengths and goals, ensuring you achieve peak performance in your chosen sport.",
    content: <img src={feature1.src} alt="Feature 1"/>,
  },
  {
    title: "Expert Coaching Across Multiple Sports",
    description:
      "Whether you're passionate about tennis, badminton, cricket, basketball, or football, our experienced instructors provide top-tier training to help you excel. Benefit from specialized techniques and strategies designed for each sport.",
    content: <img src={feature2.src} alt="Feature 2" />,
  },
  {
    title: "State-of-the-Art Facilities",
    description:
      "Train in our world-class facilities equipped with the latest technology and equipment. From indoor courts and pitches to advanced fitness centers, PlaySphere offers everything you need to enhance your skills.",
    content: <img src={feature3.src} alt="Feature 3" />,
  },
  {
    title: "Real-Time Feedback & Performance Tracking",
    description:
      "Stay ahead with our interactive coaching sessions that provide immediate feedback. Utilize our performance tracking tools to monitor your progress, set new goals, and continuously improve your game.",
    content: <img src={feature6.src} alt="Feature 4" />,
  },
  {
    title: "Comprehensive Training Programs",
    description:
      "Our dynamic curriculum is continuously updated to incorporate the latest training methodologies and sports science. Enjoy a well-rounded education that covers technique, strategy, fitness, and mental toughness.",
    content: <img src={feature5.src} alt="Feature 5" />,
  },
  {
    title: "Community & Competitive Opportunities",
    description:
      "Join a vibrant community of athletes and participate in local and national competitions. PlaySphere fosters a supportive environment where you can challenge yourself, build friendships, and showcase your talents.",
    content: <img src={feature6.src} alt="Feature 6" />,
  },
];

export default function Features() {
  return (
    <div className="pt-14 flex flex-col gap-5 bg-black">
      <h2 className="text-3xl font-bold text-center mb-8 z-10 text-white">
        Our Academy Specialization
      </h2>
      <StickyScroll content={playsphereContent} />
    </div>
  );
}
