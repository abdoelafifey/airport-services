import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      sections={[
        { heading: "What we collect", body: <p>The details you enter to book: name, email, phone number, flight number, travel dates and special requests. Payment is handled by our payment provider; we do not store your card details.</p> },
        { heading: "How we use it", body: <p>To make and manage your booking, to send your confirmation and any changes, and to contact you about your service on the day.</p> },
        { heading: "Who we share it with", body: <p>The lounge, greeter or driver providing your service receive only what they need to deliver it.</p> },
        { heading: "Your choices", body: <p>You can ask to see, correct or delete your data at any time by contacting {siteConfig.supportEmail}.</p> },
        { heading: "Passport details", body: <p>Some airports may require passport details for meet &amp; greet. If so, we will ask for them on the booking form and explain why.</p> },
      ]}
    />
  );
}
