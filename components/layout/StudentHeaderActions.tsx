"use client";

import { LayoutGrid, LogIn } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function StudentHeaderActions() {
  const pathname = usePathname();

  if (pathname === "/student") return null;

  return (
    <>
      <Link
        href="/join"
        className="inline-flex items-center gap-1.5 rounded-lg border border-violet-200 bg-white px-3 py-1.5 text-xs font-medium text-violet-700 transition-colors hover:bg-violet-50"
        aria-label="Join batch"
      >
        <LogIn className="size-3.5" />
        <span className="hidden sm:inline">Join another batch</span>
      </Link>
      <Link
        href="/student"
        className="inline-flex items-center gap-1.5 rounded-lg border border-violet-200 bg-white px-3 py-1.5 text-xs font-medium text-violet-700 transition-colors hover:bg-violet-50"
        aria-label="All batches"
      >
        <LayoutGrid className="size-3.5" />
        <span className="hidden sm:inline">All batches</span>
      </Link>
    </>
  );
}
