"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { adminLoginSchema } from "@/lib/validations/auth";

export type AdminLoginState = { error?: string } | undefined;

export async function adminLoginAction(
  _prevState: AdminLoginState,
  formData: FormData
): Promise<AdminLoginState> {
  const parsed = adminLoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Enter a valid email and password." };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/admin",
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: "Invalid email or password." };
    }
    throw err;
  }
}

export async function googleSignInAction() {
  await signIn("google", { redirectTo: "/" });
}

export type TestLoginState = { error?: string } | undefined;

export async function testLoginAction(
  _prevState: TestLoginState,
  formData: FormData
): Promise<TestLoginState> {
  if (process.env.NODE_ENV !== "development" || process.env.ENABLE_TEST_LOGIN !== "true") {
    return { error: "Test login is disabled." };
  }

  const email = (formData.get("email") as string | null)?.trim().toLowerCase();
  const password = formData.get("password") as string | null;
  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const hashed = await bcrypt.hash(password, 10);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    await prisma.user.update({ where: { email }, data: { password: hashed } });
  } else {
    await prisma.user.create({
      data: {
        email,
        name: email.split("@")[0],
        role: "STUDENT",
        status: "PENDING",
        password: hashed,
      },
    });
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: "Login failed." };
    }
    throw err;
  }
}
