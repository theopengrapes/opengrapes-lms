"use server";
import { SignJWT } from "jose";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function generateTemporaryToken(user: any, role: "student" | "teacher", meetingId: string, batchId: string) {
  const secret = new TextEncoder().encode(
    process.env.LIVE_OPENGRAPES_JWT_SECRET || "fallback-secret"
  );
  
  return await new SignJWT({
    userId: user.id,
    name: user.name || "Participant",
    email: user.email,
    role: role,
    meetingId: meetingId,
    batchId: batchId,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(secret);
}

export async function joinMeetingAction(meetingId: string) {
  const session = await getSession();
  if (!session || !session.user || session.user.role !== "STUDENT") {
    throw new Error("Unauthorized: Please log in as a student first.");
  }

  // 1. Fetch meeting & verify it exists
  const meeting = await prisma.meeting.findUnique({
    where: { id: meetingId },
    include: { batch: true },
  });

  if (!meeting) {
    throw new Error("Meeting session not found.");
  }

  // 2. Validate enrollment
  const enrolled = await prisma.enrollment.findUnique({
    where: {
      studentId_batchId: {
        studentId: session.user.id,
        batchId: meeting.batchId,
      },
    },
  });

  if (!enrolled || enrolled.status !== "APPROVED") {
    throw new Error("You are not enrolled in this batch.");
  }

  // 3. Generate token for student role
  const token = await generateTemporaryToken(session.user, "student", meeting.id, meeting.batchId);

  const meetingPlatformUrl = process.env.MEETING_PLATFORM_URL || "http://localhost:3002";
  
  // 4. Redirect the student using standard handoff parameters
  redirect(`${meetingPlatformUrl}/?token=${encodeURIComponent(token)}`);
}

export async function startClassAction(batchId: string) {
  const session = await getSession();
  if (!session || !session.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Please log in as an administrator/teacher first.");
  }

  // 1. Check if a class is already running for this batch
  const existingLiveSession = await prisma.liveSession.findFirst({
    where: { batchId, status: "live" },
  });

  let meetingId: string;

  if (existingLiveSession) {
    meetingId = existingLiveSession.roomId;
  } else {
    // Create a new meeting record automatically
    const formattedDate = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    
    const meeting = await prisma.meeting.create({
      data: {
        batchId,
        title: `Class - ${formattedDate}`,
        description: `Live class started on ${formattedDate}`,
        date: new Date(),
        link: process.env.MEETING_PLATFORM_URL || "http://localhost:3002",
        status: "LIVE",
      },
    });
    meetingId = meeting.id;
  }

  // 2. Generate token for teacher role
  const token = await generateTemporaryToken(session.user, "teacher", meetingId, batchId);

  const meetingPlatformUrl = process.env.MEETING_PLATFORM_URL || "http://localhost:3002";

  revalidatePath("/admin/meetings");
  revalidatePath("/student/meetings");

  // 3. Redirect the teacher using standard handoff parameters
  redirect(`${meetingPlatformUrl}/?token=${encodeURIComponent(token)}`);
}

