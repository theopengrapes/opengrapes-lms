"use client";

import { useActionState } from "react";
import { testLoginAction, type TestLoginState } from "@/app/login/actions";
import { Button } from "@/components/ui/Button";
import { FormField, Input } from "@/components/ui/Field";

export function TestLoginForm() {
  const [state, formAction, pending] = useActionState<TestLoginState, FormData>(
    testLoginAction,
    undefined
  );

  return (
    <form action={formAction} className="space-y-4">
      <FormField label="Email" htmlFor="test-email">
        <Input
          id="test-email"
          name="email"
          type="email"
          placeholder="student@sample.com"
          required
          autoComplete="email"
        />
      </FormField>
      <FormField label="Password" htmlFor="test-password">
        <Input
          id="test-password"
          name="password"
          type="password"
          placeholder="anything"
          required
          autoComplete="off"
        />
      </FormField>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <Button type="submit" className="w-full" loading={pending}>
        Test sign in
      </Button>
    </form>
  );
}
