import { Link2, NotebookText } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { getSession } from "@/lib/session";
import { getActiveStudentBatch } from "@/lib/batch";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function StudentNotesPage() {
  const session = await getSession();
  if (!session || session.user.role !== "STUDENT") redirect("/");
  const batch = await getActiveStudentBatch(session);
  if (!batch) redirect("/student");

  const notes = await prisma.note.findMany({
    where: { batchId: batch.id },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Notes</h1>
        <p className="mt-1 text-sm text-slate-500">Browse study material shared by your teacher.</p>
      </div>

      {notes.length === 0 ? (
        <EmptyState icon={NotebookText} title="No notes yet" description="Your teacher hasn't shared any notes." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <Link key={note.id} href={`/student/notes/${note.id}`}>
              <Card className="flex h-full flex-col transition-shadow hover:shadow-md hover:shadow-violet-100">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium text-slate-800">{note.title}</h3>
                  <Badge color="violet">{note.subject}</Badge>
                </div>
                <p className="mt-2 line-clamp-3 flex-1 text-sm text-slate-500">{note.content}</p>
                {note.fileUrl && (
                  <span className="mt-2 inline-flex items-center gap-1 text-xs text-violet-600">
                    <Link2 className="size-3" />
                    Attachment
                  </span>
                )}
                <p className="mt-2 text-xs text-slate-400">Updated {formatDate(note.updatedAt)}</p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
