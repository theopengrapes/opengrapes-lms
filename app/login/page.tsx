import { ClipboardCheck, Grape, Video, Wallet } from "lucide-react";
import { redirect } from "next/navigation";
import { googleSignInAction } from "@/app/login/actions";
import { AdminLoginForm } from "@/components/auth/AdminLoginForm";
import { GoogleIcon } from "@/components/auth/GoogleIcon";
import { TestLoginForm } from "@/components/auth/TestLoginForm";
import { auth } from "@/lib/auth";

const FEATURES = [
  { icon: Video, label: "Live classes" },
  { icon: ClipboardCheck, label: "Tests & results" },
  { icon: Wallet, label: "Fees tracking" },
];

export default async function LoginPage() {
  const session = await auth();
  if (session) {
    redirect("/");
  }

  return (
    <main className="flex h-dvh flex-1 flex-col overflow-hidden lg:grid lg:grid-cols-2">
      {/* Brand / visual half */}
      <div className="relative isolate hidden flex-col justify-center overflow-hidden bg-linear-to-br from-violet-200 via-fuchsia-100 to-indigo-200 px-8 py-16 sm:px-12 lg:flex lg:px-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -left-16 size-72 rounded-full bg-violet-300/50 blur-3xl motion-safe:animate-blob-slow sm:size-96"
        />
        <div
          aria-hidden="true"
          style={{ animationDelay: "-10s" }}
          className="pointer-events-none absolute top-1/3 -right-20 size-80 rounded-full bg-indigo-300/45 blur-3xl motion-safe:animate-blob-slower sm:size-[26rem]"
        />
        <div
          aria-hidden="true"
          style={{ animationDelay: "-16s" }}
          className="pointer-events-none absolute -bottom-24 left-1/4 size-72 rounded-full bg-fuchsia-300/40 blur-3xl motion-safe:animate-blob-slow"
        />

        <div aria-hidden="true" className="absolute inset-0 bg-dot-grid text-violet-900/5" />

        <div className="relative z-10 mx-auto w-full max-w-md lg:mx-0">
          <div className="flex items-center gap-2 text-violet-700">
            <Grape className="size-5" aria-hidden="true" />
            <span className="text-sm font-semibold tracking-[0.2em] uppercase">Batch LMS</span>
          </div>

          <h1 className="mt-6 font-display text-5xl font-extrabold tracking-tight text-slate-800 sm:text-6xl lg:text-7xl">
            OpenGrapes
          </h1>
          <p className="mt-5 max-w-sm text-base text-slate-600 sm:text-lg">
            Live classes, notes, tests, and fees — everything your batch needs in one calm place.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            {FEATURES.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-full bg-white/60 px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-white/70 backdrop-blur-sm"
              >
                <Icon className="size-4 text-violet-600" aria-hidden="true" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sign-in half */}
      <div className="flex flex-1 items-center justify-center overflow-y-auto px-6 py-8 sm:px-12 sm:py-12 lg:px-16">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-[0_2px_10px_-2px_rgba(15,23,42,0.06),0_24px_60px_-20px_rgba(124,58,237,0.35)] ring-1 ring-slate-900/5 sm:p-10">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-200">
              <Grape className="size-6" aria-hidden="true" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-slate-800 lg:hidden">
              OpenGrapes
            </span>
          </div>

          <h2 className="mt-6 font-display text-3xl font-bold tracking-tight text-slate-800">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-slate-500">Sign in to access your batch dashboard.</p>

          <form action={googleSignInAction} className="mt-8">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md focus-visible:ring-2 focus-visible:ring-violet-200 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <GoogleIcon className="size-5" />
              Continue with Google
            </button>
          </form>
          <p className="mt-3 text-center text-xs text-slate-400">
            New accounts need teacher approval before accessing the dashboard.
          </p>

          <div className="mt-8 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-100" />
            <span className="text-xs font-medium tracking-wide text-slate-400 uppercase">
              Teacher / Admin
            </span>
            <div className="h-px flex-1 bg-slate-100" />
          </div>

          <div className="mt-6">
            <AdminLoginForm />
          </div>

          {process.env.NODE_ENV === "development" &&
            process.env.ENABLE_TEST_LOGIN === "true" && (
              <>
                <div className="mt-8 flex items-center gap-3">
                  <div className="h-px flex-1 bg-amber-200" />
                  <span className="text-xs font-medium tracking-wide text-amber-500 uppercase">
                    Test login (dev only)
                  </span>
                  <div className="h-px flex-1 bg-amber-200" />
                </div>
                <div className="mt-6">
                  <TestLoginForm />
                </div>
              </>
            )}
        </div>
      </div>
    </main>
  );
}
