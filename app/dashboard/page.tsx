import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      profile: true,
      userBadges: {
        include: {
          badge: true,
        },
      },
    },
  });

  if (!user) {
    return redirect("/login");
  }

  return (
    <main className="p-4 text-white">
      <h1 className="text-2xl font-bold">Welcome, {user.name || user.username}!</h1>
      <p>Email: {user.email}</p>
      <p>Username: {user.username}</p>
      <p>Badges: {user.userBadges.length}</p>
      <p>Bio: {user.profile?.bio || "No bio set"}</p>
    </main>
  );
}
