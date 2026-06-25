"use client";

import { LayoutGrid } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminHeaderActions() {
  const pathname = usePathname();

  if (pathname === "/admin") return null;

  return (
    <Link
      href="/admin"
      className="inline-flex items-center gap-1.5 rounded-lg border border-violet-200 bg-white px-3 py-1.5 text-xs font-medium text-violet-700 transition-colors hover:bg-violet-50"
      aria-label="All batches"
    >
      <LayoutGrid className="size-3.5" />
      <span className="hidden sm:inline">All batches</span>
    </Link>
  );
}
