import { redirect } from "next/navigation";
import { MeetingsManager } from "@/components/admin/MeetingsManager";
import { getSession } from "@/lib/session";
import { getActiveBatch } from "@/lib/batch";
import { prisma } from "@/lib/prisma";

export default async function AdminMeetingsPage() {
  const session = await getSession();
  if (!session || session.user.role !== "ADMIN") redirect("/login");
  const batch = await getActiveBatch(session);
  if (!batch) redirect("/admin");

  const meetings = await prisma.meeting.findMany({
    where: { batchId: batch.id },
    orderBy: { date: "desc" },
  });

  const liveSession = await prisma.liveSession.findFirst({
    where: { batchId: batch.id, status: "live" },
  });

  return (
    <MeetingsManager
      meetings={meetings}
      liveSession={liveSession}
      batchId={batch.id}
    />
  );
}
