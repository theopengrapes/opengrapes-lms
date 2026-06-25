"use client";

import Link from "next/link";
import { useActionState } from "react";
import { teacherGoogleSignInAction, teacherSignupAction } from "@/app/signup/actions";
import { GoogleIcon } from "@/components/auth/GoogleIcon";
import { Button } from "@/components/ui/Button";
import { FormField, Input } from "@/components/ui/Field";

export function TeacherSignupForm() {
  const [state, formAction, pending] = useActionState(teacherSignupAction, undefined);

  return (
    <div className="space-y-4">
      <form action={formAction} className="space-y-3">
        <FormField label="Name" htmlFor="signup-name" error={state?.errors?.name}>
          <Input
            id="signup-name"
            name="name"
            type="text"
            placeholder="Ms. Rao"
            required
            autoComplete="name"
            defaultValue={state?.values?.name}
          />
        </FormField>
        <FormField
          label="Email"
          htmlFor="signup-email"
          error={state?.errors?.email === "exists" ? undefined : state?.errors?.email}
        >
          <Input
            id="signup-email"
            name="email"
            type="email"
            placeholder="you@school.com"
            required
            autoComplete="email"
            defaultValue={state?.values?.email}
          />
        </FormField>
        {state?.errors?.email === "exists" && (
          <p className="text-sm text-red-600">
            An account with this email already exists —{" "}
            <Link href="/login" className="font-medium underline hover:text-red-700">
              log in instead
            </Link>
            .
          </p>
        )}
        <FormField label="Password" htmlFor="signup-password" error={state?.errors?.password}>
          <Input
            id="signup-password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            autoComplete="new-password"
          />
        </FormField>
        <FormField
          label="Confirm password"
          htmlFor="signup-confirm"
          error={state?.errors?.confirmPassword}
        >
          <Input
            id="signup-confirm"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            required
            autoComplete="new-password"
          />
        </FormField>
        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
        <Button
          type="submit"
          className="w-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:outline-none"
          loading={pending}
        >
          Create my account
        </Button>
      </form>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-100" />
        <span className="text-xs font-medium tracking-wide text-slate-400 uppercase">Or</span>
        <div className="h-px flex-1 bg-slate-100" />
      </div>

      <form action={teacherGoogleSignInAction}>
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md focus-visible:ring-2 focus-visible:ring-violet-200 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <GoogleIcon className="size-5" />
          Continue with Google
        </button>
      </form>
    </div>
  );
}
