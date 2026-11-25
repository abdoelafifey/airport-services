/**
 * Brand and navigation. PLACEHOLDERS until the client sends the real brand.
 * Swap `name`, the logo component and the accent token in globals.css.
 */
export const siteConfig = {
  name: "Brand Name",
  description:
    "Book airport lounges, meet & greet and hotel-to-airport transfers. Confirmation goes straight to your email.",
  supportEmail: "support@example.com",
  supportPhone: "+00 000 000 000",
} as const;

export const serviceNav = [
  { label: "Airport Lounge", href: "/lounges", service: "lounge" },
  { label: "Meet & Greet", href: "/meet-and-greet", service: "meet-greet" },
  { label: "To Airport", href: "/to-airport", service: "to-airport" },
] as const;

export const legalNav = [
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Amendments, Refund & Cancellation", href: "/cancellation-policy" },
] as const;

export const supportNav = [
  { label: "Find my booking", href: "/manage" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
] as const;
