import { Grape } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { TeacherSignupForm } from "@/components/auth/TeacherSignupForm";
import { auth } from "@/lib/auth";

export default async function SignupPage() {
  const session = await auth();
  if (session) redirect("/");

  return (
    <main className="flex h-screen items-center justify-center px-4 py-4">
      <div className="w-full max-w-md rounded-3xl bg-white px-8 py-6 shadow-[0_2px_10px_-2px_rgba(15,23,42,0.06),0_24px_60px_-20px_rgba(124,58,237,0.35)] ring-1 ring-slate-900/5 sm:px-10 sm:py-7">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-200">
            <Grape className="size-5" aria-hidden="true" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-slate-800">
            OpenGrapes
          </span>
        </div>

        <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-slate-800">
          Create your account
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Set up your teacher account, then create your first batch.
        </p>

        <div className="mt-5">
          <TeacherSignupForm />
        </div>

        <p className="mt-4 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-violet-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
