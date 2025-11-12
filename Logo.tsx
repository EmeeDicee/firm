"use client";

import { useState } from "react";
import Image from "next/image";

type LogoProps = {
  size?: number; // pixel size of square box
  className?: string;
  title?: string;
  ariaLabel?: string;
  priority?: boolean;
  decorative?: boolean; // mark as decorative and hide from a11y tree
};

/**
 * Unified Logo component.
 * - Renders the SVG brand mark from /brand/logo.svg
 * - Falls back to inline SVG if asset loading fails
 * - Accessible by default with alt/title; can be decorative
 */
export default function Logo({
  size = 40,
  className = "",
  title = "Keylite Trade",
  ariaLabel = "Keylite Trade logo",
  priority = false,
  decorative = false,
}: LogoProps) {
  const [broken, setBroken] = useState(false);

  if (broken) {
    return (
      <InlineMark
        size={size}
        className={className}
        title={title}
        ariaLabel={ariaLabel}
        decorative={decorative}
      />
    );
  }

  return (
    <span className={`inline-block ${className}`} style={{ width: size, height: size }}>
      <Image
        src="/brand/logo.svg?v=1"
        alt={decorative ? "" : ariaLabel}
        title={title}
        width={size}
        height={size}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        sizes={`${size}px`}
        onError={() => setBroken(true)}
      />
    </span>
  );
}

function InlineMark({
  size,
  className,
  title,
  ariaLabel,
  decorative,
}: {
  size: number;
  className?: string;
  title?: string;
  ariaLabel?: string;
  decorative?: boolean;
}) {
  return (
    <span className={`inline-block ${className}`} style={{ width: size, height: size }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        width={size}
        height={size}
        role="img"
        aria-label={decorative ? undefined : ariaLabel}
      >
        <title>{title}</title>
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FCD34D" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#22D3EE" />
          </linearGradient>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="32" cy="32" r="30" fill="#0B1220" />
        <circle cx="32" cy="32" r="29" fill="none" stroke="url(#g1)" strokeWidth="3" />
        <circle cx="32" cy="32" r="20" fill="url(#glow)" />
        <g fill="none" stroke="url(#g1)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4">
          <path d="M22 18 L22 46" />
          <path d="M22 32 L40 18" />
          <path d="M22 32 L40 46" />
        </g>
        <circle cx="48" cy="16" r="3" fill="#FCD34D" />
      </svg>
    </span>
  );
}