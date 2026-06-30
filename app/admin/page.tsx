import { redirect } from "next/navigation";
import { BatchHub } from "@/components/admin/BatchHub";
import { getSession } from "@/lib/session";
import { getTeacherHubData } from "@/lib/batch";

export default async function AdminHubPage() {
  const session = await getSession();
  if (!session || session.user.role !== "ADMIN") redirect("/");

  const { batches, stats } = await getTeacherHubData(session);

  return <BatchHub batches={batches} stats={stats} />;
}
