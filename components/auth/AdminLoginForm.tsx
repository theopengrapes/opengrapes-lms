"use client";

import { useActionState } from "react";
import { adminLoginAction } from "@/app/login/actions";
import { Button } from "@/components/ui/Button";
import { FormField, Input } from "@/components/ui/Field";

export function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(adminLoginAction, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <FormField label="Email" htmlFor="email">
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="admin@lms.com"
          required
          autoComplete="email"
        />
      </FormField>
      <FormField label="Password" htmlFor="password">
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          autoComplete="current-password"
        />
      </FormField>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <Button
        type="submit"
        className="w-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:outline-none"
        loading={pending}
      >
        Sign in as Teacher / Admin
      </Button>
    </form>
  );
}
