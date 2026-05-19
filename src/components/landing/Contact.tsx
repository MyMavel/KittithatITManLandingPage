"use client";

import { useState } from "react";

type FieldErrors = Partial<Record<"name" | "email" | "company" | "message", string>>;

export default function Contact() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setServerError(null);
    setErrors({});

    const data = Object.fromEntries(new FormData(e.currentTarget).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        if (body.fieldErrors) {
          setErrors(body.fieldErrors as FieldErrors);
        } else {
          setServerError(body.error ?? "Something went wrong. Please try again.");
        }
        return;
      }
      setDone(true);
    } catch {
      setServerError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="contact" className="bg-white">
      <div className="mx-auto max-w-3xl px-6 py-24">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Get in touch
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Tell us about your business — we&apos;ll reply within one business day.
          </p>
        </div>

        {done ? (
          <div className="mt-12 rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
            <h3 className="text-lg font-semibold text-emerald-900">
              Thanks — we received your message.
            </h3>
            <p className="mt-2 text-sm text-emerald-800">
              We&apos;ll be in touch shortly at the email you provided.
            </p>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="mt-12 grid gap-5 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:grid-cols-2"
            noValidate
          >
            <Field
              label="Name"
              name="name"
              required
              error={errors.name}
              autoComplete="name"
            />
            <Field
              label="Email"
              name="email"
              type="email"
              required
              error={errors.email}
              autoComplete="email"
            />
            <Field
              label="Company"
              name="company"
              error={errors.company}
              autoComplete="organization"
              className="sm:col-span-2"
            />
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-800">
                How can we help?
              </label>
              <textarea
                name="message"
                rows={5}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              {errors.message && (
                <p className="mt-1 text-xs text-red-600">{errors.message}</p>
              )}
            </div>

            {serverError && (
              <p className="sm:col-span-2 text-sm text-red-600">{serverError}</p>
            )}

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {submitting ? "Sending..." : "Send message"}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  error,
  autoComplete,
  className,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string;
  autoComplete?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-slate-800">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
