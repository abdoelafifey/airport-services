"use client";

import { BadgeCheck } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Field, inputClass } from "@/components/booking/fields";
import { buttonClass } from "@/components/ui/button";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (!String(f.get("name")).trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(f.get("email")).trim()) || String(f.get("message")).trim().length < 5) {
      setError("Please fill in your name, a valid email and your message.");
      return;
    }
    setError("");
    setSent(true); // Mock: the backend will deliver the message.
  }

  if (sent) {
    return (
      <div role="status" className="flex items-start gap-3 rounded-xl border border-line p-6">
        <BadgeCheck aria-hidden className="mt-0.5 size-6 shrink-0 text-success" />
        <div>
          <p className="font-bold">Message received</p>
          <p className="mt-1 text-ink-soft">Thanks. We will reply to your email as soon as we can.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" htmlFor="c-name"><input id="c-name" name="name" autoComplete="name" className={inputClass} /></Field>
        <Field label="Email" htmlFor="c-email"><input id="c-email" name="email" type="email" autoComplete="email" className={inputClass} /></Field>
      </div>
      <Field label="Booking reference" htmlFor="c-ref" optional><input id="c-ref" name="reference" className={`${inputClass} uppercase`} /></Field>
      <Field label="Message" htmlFor="c-msg"><textarea id="c-msg" name="message" rows={5} className={`${inputClass} h-auto py-3`} /></Field>
      {error ? <p role="alert" className="rounded-md bg-accent-soft p-3 text-sm text-danger">{error}</p> : null}
      <button type="submit" className={buttonClass({ size: "lg" })}>Send message</button>
    </form>
  );
}
