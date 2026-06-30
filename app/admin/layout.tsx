import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AdminHeaderActions } from "@/components/layout/AdminHeaderActions";
import { MobileNav, Sidebar } from "@/components/layout/Sidebar";
import { getSession } from "@/lib/session";
import { getActiveBatch } from "@/lib/batch";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session || session.user.role !== "ADMIN") redirect("/");

  const batch = await getActiveBatch(session);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        variant="admin"
        subtitle="Admin panel"
        batchName={batch?.name}
        joinCode={batch?.joinCode}
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
            <AdminHeaderActions />
          </div>
        </header>
        <MobileNav variant="admin" />
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
