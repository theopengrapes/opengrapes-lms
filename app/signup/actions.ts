"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { teacherSignupSchema } from "@/lib/validations/auth";

export async function teacherGoogleSignInAction() {
  const cookieStore = await cookies();
  cookieStore.set("auth_intent", "teacher", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 5,
  });
  await signIn("google", { redirectTo: "/admin" });
}

export type SignupState = {
  errors?: {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  };
  error?: string;
  values?: { name?: string; email?: string };
} | undefined;

export async function teacherSignupAction(
  _prev: SignupState,
  formData: FormData
): Promise<SignupState> {
  const parsed = teacherSignupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  const rawName = (formData.get("name") as string) ?? "";
  const rawEmail = (formData.get("email") as string) ?? "";
  const values = { name: rawName, email: rawEmail };

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return {
      values,
      errors: {
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
        confirmPassword: fieldErrors.confirmPassword?.[0],
      },
    };
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { values, errors: { email: "exists" } };
  }

  const hashed = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      role: "ADMIN",
      status: "APPROVED",
      plan: "FREE",
    },
  });

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/admin",
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: "Account created but sign-in failed. Please log in." };
    }
    throw err;
  }
}
