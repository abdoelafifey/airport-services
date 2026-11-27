import type { ReactNode } from "react";

export const inputClass =
  "h-12 w-full rounded-md border border-line bg-white px-3.5 text-base text-ink outline-none transition-colors placeholder:text-ink-faint hover:border-ink focus:border-ink focus:shadow-[0_0_0_1px_var(--ink)] aria-[invalid=true]:border-danger aria-[invalid=true]:shadow-[0_0_0_1px_var(--danger)]";

/** Same look as inputClass, with a custom chevron so the dropdown arrow has room instead of sticking to the border. */
export const selectClass = `${inputClass} select-caret cursor-pointer`;

export function Field({
  label,
  htmlFor,
  error,
  hint,
  optional,
  children,
  className = "",
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold">
        {label}
        {optional ? <span className="ml-1 font-normal text-ink-faint">(optional)</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-sm text-ink-soft">{hint}</p>
      ) : null}
    </div>
  );
}

export function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-line py-8 first:border-0 first:pt-0">
      <h2 className="text-[22px] font-bold tracking-[-0.01em]">{title}</h2>
      {description ? <p className="mt-1 text-ink-soft">{description}</p> : null}
      <div className="mt-5">{children}</div>
    </section>
  );
}
