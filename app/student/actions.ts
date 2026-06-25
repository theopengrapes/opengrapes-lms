"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { setActiveBatch } from "@/lib/batch";

export async function setActiveBatchAction(batchId: string) {
  const session = await auth();
  if (!session || session.user.role !== "STUDENT") {
    throw new Error("Unauthorized");
  }
  await setActiveBatch(session, batchId);
  redirect("/student/dashboard");
}
