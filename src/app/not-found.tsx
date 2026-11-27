import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Container className="max-w-xl py-24 text-center sm:py-32">
      <p className="text-sm font-semibold text-accent">404</p>
      <h1 className="mt-3 text-(length:--text-h2) font-bold tracking-[-0.02em] text-balance">We could not find that page</h1>
      <p className="mx-auto mt-3 max-w-md text-ink-soft">
        The link may be old or mistyped. Start from the home page, or go straight to a lounge. If you are looking for a booking, use the link in your confirmation email.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/" size="lg">Back to home</ButtonLink>
        <ButtonLink href="/lounges" variant="secondary" size="lg">Browse lounges</ButtonLink>
        <ButtonLink href="/manage" variant="secondary" size="lg">Find my booking</ButtonLink>
      </div>
    </Container>
  );
}
