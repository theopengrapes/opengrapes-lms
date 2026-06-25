import { Inter, Space_Grotesk } from "next/font/google";
import { redirect } from "next/navigation";
import { LandingPage } from "@/components/landing/LandingPage";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default async function Home() {
  const session = await auth();

  if (!session) {
    return (
      <div className={`${spaceGrotesk.variable} ${inter.variable} flex-1`}>
        <LandingPage />
      </div>
    );
  }

  if (session.user.role === "SUPER_ADMIN") redirect("/platform");
  if (session.user.role === "ADMIN") redirect("/admin");

  const approvedCount = await prisma.enrollment.count({
    where: {
      studentId: session.user.id,
      status: "APPROVED",
      batch: { teacher: { status: { not: "SUSPENDED" } } },
    },
  });

  if (approvedCount === 1) redirect("/student/dashboard");
  redirect("/student");
}
