import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { MobileNav, Sidebar } from "@/components/layout/Sidebar";
import { StudentHeaderActions } from "@/components/layout/StudentHeaderActions";
import { getSession } from "@/lib/session";
import { getActiveStudentBatch } from "@/lib/batch";

export default async function StudentLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session || session.user.role !== "STUDENT") {
    redirect("/");
  }

  const batch = await getActiveStudentBatch(session);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        variant="student"
        subtitle="Student"
        batchName={batch?.name}
        userName={session.user.name}
        userEmail={session.user.email}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-violet-100 bg-white/50 px-4 py-3 backdrop-blur-sm md:px-8">
          <div className="min-w-0">
            <p className="text-sm text-slate-500">
              Signed in as{" "}
              <span className="font-semibold text-slate-800">
                {session.user.name ?? session.user.email}
              </span>
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <StudentHeaderActions />
          </div>
        </header>
        <MobileNav variant="student" />
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
