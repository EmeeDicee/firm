"use client";

import BrandedLoader from "@/components/global/BrandedLoader";

export default function Loading() {
  return (
    <div className="min-h-screen grid place-items-center">
      <BrandedLoader label="Loading" />
    </div>
  );
}