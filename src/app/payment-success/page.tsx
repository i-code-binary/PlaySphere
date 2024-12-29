"use client";

import React, { Suspense } from "react";
import PaymentSuccessPage from "./PaymentSuccessPage";

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <PaymentSuccessPage />
    </Suspense>
  );
}

function Loading() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "black",
        color: "white",
        fontSize: "1.5rem",
      }}
    >
      Loading...
    </div>
  );
}
