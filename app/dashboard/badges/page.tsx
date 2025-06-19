// app/dashboard/badges/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function BadgesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return redirect("/login");
  }

  const badges = await prisma.badge.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const userBadges = await prisma.userBadge.findMany({
    where: { userId: session.user.id },
    include: { badge: true },
  });

  const userBadgeIds = userBadges.map((ub) => ub.badgeId);

  return (
    <main className="p-4 text-white">
      <h2 className="text-2xl font-bold mb-4">Your Badges</h2>
      <ul>
        {badges.map((badge) => (
          <li key={badge.id} className="mb-2 flex items-center space-x-3">
            <img src={badge.icon} alt={badge.name} className="w-6 h-6" />
            <span>{badge.name}</span>
            {userBadgeIds.includes(badge.id) ? (
              <span className="ml-auto text-green-400 font-semibold">Owned</span>
            ) : (
              <span className="ml-auto text-gray-400">Not owned</span>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
