"use client";
import SportsPage from "@/components/SportsPage";
import { useEffect } from "react";

export default function SportsHomePage() {
  useEffect(() => {
    document.title = "Sports";

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Sports page");
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = "All sports";
      document.head.appendChild(meta);
    }
  }, []);
  return (
    <>
      <div>
        <SportsPage />
      </div>
    </>
  );
}
