import { cn } from "@/utility/cn";
import Link from "next/link";

const Navbar = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "fixed top-10 inset-x-0 max-w-2xl mx-auto z-50 rounded-full py-4 border-2 bg-black",
        className
      )}
    >
      <ul className="flex justify-center items-center gap-16 text-white text-xl">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/sports">Sports</Link>
        </li>
        <li>
          <Link href="/contact">contact Us</Link>
        </li>
        <li>
          <Link href="/payment">Payment</Link>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
