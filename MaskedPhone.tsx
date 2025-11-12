"use client";

import { COMPANY } from "@/config/company";
import { maskPhoneDisplay, telHref } from "@/lib/maskPhone";

type MaskedPhoneProps = {
  phone?: string;
  className?: string;
  revealLast?: number;
  keepCountry?: boolean;
  keepArea?: boolean;
  link?: boolean; // whether to render as <a href="tel:"> ... masked display
};

export default function MaskedPhone({
  phone = COMPANY.phone,
  className = "",
  revealLast = 2,
  keepCountry = true,
  keepArea = true,
  link = true,
}: MaskedPhoneProps) {
  const display = maskPhoneDisplay(phone, { revealLast, keepCountry, keepArea });
  const title = "Phone number masked for privacy";
  const aria = "Company phone number (masked)";

  if (link) {
    return (
      <a className={className} href={telHref(phone)} title={title} aria-label={aria}>
        {display}
      </a>
    );
  }
  return (
    <span className={className} title={title} aria-label={aria}>
      {display}
    </span>
  );
}