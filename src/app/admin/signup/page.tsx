"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signupAction, type AuthState } from "../login/actions";
import { Header, Field } from "../login/page";

const initial: AuthState = {};

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signupAction, initial);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-sm">
        <Header
          title="Create admin account"
          subtitle="Sign up to access the KittithatITMan operations console"
        />

        {state.notice ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-sm text-emerald-900">
            <p className="font-medium">Check your email</p>
            <p className="mt-1 text-emerald-800">{state.notice}</p>
            <Link
              href="/admin/login"
              className="mt-4 inline-flex items-center text-sm font-semibold text-emerald-800 hover:text-emerald-900"
            >
              Go to sign in →
            </Link>
          </div>
        ) : (
          <form
            action={formAction}
            className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <Field
              label="Full name"
              name="fullName"
              autoComplete="name"
              required
              autoFocus
              error={state.fieldErrors?.fullName}
            />
            <Field
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              required
              error={state.fieldErrors?.email}
            />
            <Field
              label="Password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              error={state.fieldErrors?.password}
            />
            <p className="text-xs text-slate-500">
              Use at least 8 characters.
            </p>
            {state.error && (
              <p className="text-sm text-red-600">{state.error}</p>
            )}
            <button
              type="submit"
              disabled={pending}
              className="inline-flex w-full items-center justify-center rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? "Creating account..." : "Create account"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            href="/admin/login"
            className="font-medium text-brand-700 hover:text-brand-800"
          >
            Sign in
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
