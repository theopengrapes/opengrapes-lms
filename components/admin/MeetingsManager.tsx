"use client";

import { Play, Square, Video } from "lucide-react";
import { useTransition } from "react";
import toast from "react-hot-toast";
import { setMeetingStatus } from "@/app/admin/meetings/actions";
import { startClassAction } from "@/app/actions/meeting";
import type { Meeting, LiveSession } from "@/app/generated/prisma/client";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDateTime } from "@/lib/utils";

export function MeetingsManager({
  meetings,
  liveSession,
  batchId,
}: {
  meetings: Meeting[];
  liveSession: LiveSession | null;
  batchId: string;
}) {
  const [pending, startTransition] = useTransition();

  const activeMeeting = liveSession
    ? meetings.find((m) => m.id === liveSession.roomId)
    : null;

  const pastMeetings = meetings.filter(
    (m) => m.status === "ENDED" && m.id !== liveSession?.roomId
  );

  function handleEndMeeting(id: string) {
    if (!confirm("Are you sure you want to end this class?")) return;
    startTransition(async () => {
      const result = await setMeetingStatus(id, "ENDED");
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Class session ended successfully");
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Meetings</h1>
          <p className="mt-1 text-sm text-slate-500">
            Start live sessions and manage class history.
          </p>
        </div>
        {!liveSession && (
          <form action={startClassAction.bind(null, batchId)}>
            <Button type="submit" variant="primary">
              <Play className="size-4" />
              Start Class
            </Button>
          </form>
        )}
      </div>

      {/* Active Session Card */}
      {liveSession && (
        <Card className="border-emerald-200 bg-emerald-50/30">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge color="green" className="animate-pulse">
                  ● LIVE NOW
                </Badge>
                <h3 className="font-semibold text-slate-800">
                  {activeMeeting?.title || "Active Class"}
                </h3>
              </div>
              <p className="text-sm text-slate-500">
                Class is currently in progress. Students can join from their dashboard.
              </p>
              <p className="text-xs text-slate-400">
                Started at {formatDateTime(liveSession.startedAt)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <form action={startClassAction.bind(null, batchId)}>
                <Button type="submit" size="sm" variant="secondary">
                  <Video className="size-3.5" /> Rejoin
                </Button>
              </form>
              <Button
                size="sm"
                variant="outline"
                loading={pending}
                onClick={() => handleEndMeeting(liveSession.roomId)}
                className="border-rose-200 text-rose-700 hover:bg-rose-50"
              >
                <Square className="size-3.5" /> End Class
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Past History */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-700">Past Classes</h2>
        {pastMeetings.length === 0 ? (
          <EmptyState
            icon={Video}
            title="No past classes"
            description="All your ended live class sessions will be displayed here."
          />
        ) : (
          <div className="divide-y divide-slate-100 rounded-lg border border-slate-100 bg-white">
            {pastMeetings.map((meeting) => (
              <div
                key={meeting.id}
                className="flex items-center justify-between p-4"
              >
                <div className="space-y-1">
                  <h4 className="font-medium text-slate-800">{meeting.title}</h4>
                  <p className="text-xs text-slate-400">
                    Ended on {formatDateTime(meeting.date)}
                  </p>
                </div>
                <Badge color="slate">Ended</Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
