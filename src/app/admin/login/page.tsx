"use client";

import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { loginAction, type AuthState } from "./actions";

const initial: AuthState = {};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-sm">
        <Header
          title="Sign in to admin"
          subtitle="KittithatITMan operations console"
        />
        <Suspense fallback={<FormSkeleton />}>
          <LoginForm />
        </Suspense>
        <p className="mt-6 text-center text-sm text-slate-500">
          Need an account?{" "}
          <Link
            href="/admin/signup"
            className="font-medium text-brand-700 hover:text-brand-800"
          >
            Sign up
          </Link>
        </p>
        <p className="mt-2 text-center text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-700">
            ← Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}

function LoginForm() {
  const params = useSearchParams();
  const next = params.get("next") ?? "/admin";
  const [state, formAction, pending] = useActionState(loginAction, initial);

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <input type="hidden" name="next" value={next} />
      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        autoFocus
        error={state.fieldErrors?.email}
      />
      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        error={state.fieldErrors?.password}
      />
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}

export function Header({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-8 flex flex-col items-center">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-lg font-bold text-white">
        K
      </span>
      <h1 className="mt-4 text-xl font-semibold text-slate-900">{title}</h1>
      <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
    </div>
  );
}

export function Field({
  label,
  name,
  type = "text",
  autoComplete,
  required,
  autoFocus,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  autoFocus?: boolean;
  error?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-800">
        {label}
      </label>
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        autoFocus={autoFocus}
        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

function FormSkeleton() {
  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="h-16 animate-pulse rounded bg-slate-100" />
      <div className="h-16 animate-pulse rounded bg-slate-100" />
      <div className="h-10 animate-pulse rounded bg-slate-100" />
    </div>
  );
}
