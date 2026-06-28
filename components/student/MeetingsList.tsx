"use client";

import { useState } from "react";
import { ClipboardList, FileDown } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { formatDateTime } from "@/lib/utils";

interface Meeting {
  id: string;
  title: string;
  description: string | null;
  date: Date | string;
  status: string;
}

interface LiveSession {
  id: string;
  roomId: string;
  hasNotes: boolean;
  meetingMinutes?: {
    content: string;
  } | null;
}

interface MeetingsListProps {
  meetings: Meeting[];
  liveSessions: LiveSession[];
}

export function MeetingsList({ meetings, liveSessions }: MeetingsListProps) {
  const [activeMoM, setActiveMoM] = useState<{ title: string; content: string } | null>(null);
  const [visibleCount, setVisibleCount] = useState(4);

  // Map liveSession roomId to details
  const sessionMap = new Map(
    liveSessions.map((ls) => [
      ls.roomId,
      {
        hasNotes: ls.hasNotes === true,
        minutes: ls.meetingMinutes?.content || null,
      },
    ])
  );

  const visibleMeetings = meetings.slice(0, visibleCount);

  return (
    <div className="divide-y divide-slate-100 rounded-lg border border-slate-100 bg-white">
      {visibleMeetings.map((meeting) => {
        const sessionDetails = sessionMap.get(meeting.id);
        const hasNotes = sessionDetails?.hasNotes ?? false;
        const minutes = sessionDetails?.minutes ?? null;

        return (
          <div key={meeting.id} className="flex items-center justify-between p-4 gap-4">
            <div className="space-y-1 min-w-0 flex-1">
              <h4 className="font-medium text-slate-800 truncate" title={meeting.title}>
                {meeting.title}
              </h4>
              <p className="text-xs text-slate-400">
                Ended on {formatDateTime(meeting.date)}
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              {/* Minutes of Meeting (MoM) Dialog Trigger */}
              {minutes ? (
                <button
                  type="button"
                  onClick={() => setActiveMoM({ title: meeting.title, content: minutes })}
                  className="p-2 rounded-lg bg-violet-50 text-violet-600 hover:bg-violet-100 transition-colors cursor-pointer"
                  title="View Minutes of Meeting (MoM)"
                >
                  <ClipboardList className="size-4" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="p-2 rounded-lg bg-slate-50 text-slate-350 opacity-40 cursor-not-allowed"
                  title="No Minutes of Meeting (MoM) available for class"
                >
                  <ClipboardList className="size-4" />
                </button>
              )}

              {/* Whiteboard Notes PDF Download */}
              {hasNotes ? (
                <a
                  href={`https://opengrapes-whiteboard-sync.manasrikhari23.workers.dev/api/pdf/${meeting.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-violet-50 text-violet-600 hover:bg-violet-100 transition-colors cursor-pointer"
                  title="Download Class Notes PDF"
                >
                  <FileDown className="size-4" />
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="p-2 rounded-lg bg-slate-50 text-slate-350 opacity-40 cursor-not-allowed"
                  title="No notes available for class"
                >
                  <FileDown className="size-4" />
                </button>
              )}

              <Badge color="slate">Ended</Badge>
            </div>
          </div>
        );
      })}

      {meetings.length > visibleCount && (
        <div className="flex justify-center p-3 border-t border-slate-50 bg-slate-50/10">
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => prev + 4)}
            className="px-4 py-2 text-xs font-semibold text-violet-600 hover:text-violet-750 bg-violet-50 hover:bg-violet-100/80 rounded-xl transition-all cursor-pointer shadow-xs"
          >
            Load More Meetings
          </button>
        </div>
      )}

      {/* MoM Content Lightbox Dialog */}
      <Modal
        open={!!activeMoM}
        onClose={() => setActiveMoM(null)}
        title={`Minutes of Meeting: ${activeMoM?.title || ""}`}
      >
        {activeMoM && (
          <div className="space-y-4">
            <div className="text-sm text-slate-650 leading-relaxed whitespace-pre-wrap bg-slate-50/50 p-4 border border-slate-100 rounded-xl max-h-[60vh] overflow-y-auto scrollbar-thin">
              {activeMoM.content}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
