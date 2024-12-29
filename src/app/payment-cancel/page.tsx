import PaymentCancelContent from "@/components/PaymentCancelContent";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex w-screen h-screen justify-center items-center">
          Loading...
        </div>
      }
    >
      <PaymentCancelContent />
    </Suspense>
  );
}
