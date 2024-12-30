"use client";
import FeaturedSports from "@/components/FeaturedSports";
import FrontPage from "../components/FrontPage";
import { Spotlight } from "../components/ui/spotlight";
import Footer from "@/components/Footer";
import Features from "@/components/Features";
import OurTestimonials from "../components/OurTestimonials";
import ChatBot from "@/components/Chat";
import Head from "next/head";
import { useEffect } from "react";
import { signOut } from "next-auth/react";

export default function Home() {
  useEffect(() => {
    // Update title
    document.title = "PlaySphere";

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Play Sphere home page");
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = "Play Sphere home page";
      document.head.appendChild(meta);
    }
  }, []);
  const handleLogout = () => {
    signOut({ callbackUrl: "/" }); // Redirect to homepage after logout
  };
  return (
    // <html lang="en">
    <div className="w-screen">
      <Head>
        <title>PlaySphere</title>
        <meta name="description" content="Play Sphere home page" />
      </Head>
      <button onClick={handleLogout}>Logout</button>
      <Spotlight />
      <FrontPage />
      <FeaturedSports />
      <Features />
      <OurTestimonials />
      <ChatBot />
      <Footer />
    </div>
    // </html>
  );
}
