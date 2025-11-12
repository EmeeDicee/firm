"use client";

import Logo from "@/components/global/Logo";

/**
 * Branded loader using GPU-accelerated transforms.
 * - 60fps on modern devices
 * - Respects prefers-reduced-motion
 * - Works against light/dark backgrounds
 */
export default function BrandedLoader({ label = "Loading" }: { label?: string }) {
  return (
    <div className="brand-loader" role="status" aria-live="polite" aria-label={label}>
      <div className="brand-loader__content">
        <div className="brand-loader__rings" aria-hidden="true">
          <span className="ring ring--a" />
          <span className="ring ring--b" />
        </div>
        <div className="brand-loader__mark">
          <Logo size={42} decorative />
        </div>
      </div>
      <div className="brand-loader__text" aria-hidden="true">{label}…</div>
    </div>
  );
}