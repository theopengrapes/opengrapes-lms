import { redirect } from "next/navigation";
import { NotesManager } from "@/components/admin/NotesManager";
import { getSession } from "@/lib/session";
import { getActiveBatch } from "@/lib/batch";
import { prisma } from "@/lib/prisma";

export default async function AdminNotesPage() {
  const session = await getSession();
  if (!session || session.user.role !== "ADMIN") redirect("/login");
  const batch = await getActiveBatch(session);
  if (!batch) redirect("/admin");

  const notes = await prisma.note.findMany({
    where: { batchId: batch.id },
    orderBy: { updatedAt: "desc" },
  });

  return <NotesManager notes={notes} />;
}
