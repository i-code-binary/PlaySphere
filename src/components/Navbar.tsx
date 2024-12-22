"use client";

import { cn } from "@/utility/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = ({ className }: { className?: string }) => {
  const pathname = usePathname(); // Get the current path

  // Define an array of navigation links
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/sports", label: "Sports" },
    { href: "/contact", label: "Contact Us" },
    { href: "/payment", label: "Payment" },
  ];

  return (
    <div
      className={cn(
        "fixed top-10 inset-x-0 max-w-2xl mx-auto z-50 rounded-full py-4 border-2 bg-black",
        className
      )}
    >
      <ul className="flex justify-center items-center gap-16 text-white text-xl">
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={cn(
                pathname === link.href
                  ? "text-blue-500 font-semibold"
                  : "text-white"
              )}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Navbar;
