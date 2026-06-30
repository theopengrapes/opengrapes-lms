import { redirect } from "next/navigation";
import { MeetingsManager } from "@/components/admin/MeetingsManager";
import { getSession } from "@/lib/session";
import { getActiveBatch } from "@/lib/batch";
import { prisma } from "@/lib/prisma";

export default async function AdminMeetingsPage() {
  const session = await getSession();
  if (!session || session.user.role !== "ADMIN") redirect("/");
  const batch = await getActiveBatch(session);
  if (!batch) redirect("/admin");

  const meetings = await prisma.meeting.findMany({
    where: { batchId: batch.id },
    orderBy: { date: "desc" },
  });

  const liveSession = await prisma.liveSession.findFirst({
    where: { batchId: batch.id, status: "live" },
  });

  const liveSessions = await prisma.liveSession.findMany({
    where: {
      roomId: { in: meetings.map((m) => m.id) }
    },
    include: {
      meetingMinutes: true
    }
  });

  return (
    <MeetingsManager
      meetings={meetings}
      liveSession={liveSession}
      liveSessions={liveSessions}
      batchId={batch.id}
    />
  );
}
