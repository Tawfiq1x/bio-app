import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { BadgeCheck, Lock, Sparkles } from "lucide-react";

export default async function BadgesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) return redirect("/login");

  const globalBadges = await prisma.badge.findMany({
    where: { global: true },
    orderBy: { createdAt: "desc" },
  });

  const userBadges = await prisma.userBadge.findMany({
    where: { userId: session.user.id },
    include: { badge: true },
  });

  const ownedBadgeIds = new Set(userBadges.map((ub) => ub.badgeId));

  return (
    <main className="p-4 max-w-4xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-4">Available Badges</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {globalBadges.map((badge) => {
          const owned = ownedBadgeIds.has(badge.id);
          const isClaimable = false; // badges are admin-only

          return (
            <div
              key={badge.id}
              className={`rounded-xl p-4 bg-gray-900 border ${
                owned
                  ? "border-green-500"
                  : isClaimable
                  ? "border-yellow-500"
                  : "border-gray-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={badge.iconUrl}
                  alt={badge.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h2 className="text-lg font-semibold">{badge.name}</h2>
                  <p className="text-sm text-gray-400">{badge.description}</p>
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center">
                {owned ? (
                  <span className="text-green-400 flex items-center gap-1">
                    <BadgeCheck size={16} /> Owned
                  </span>
                ) : isClaimable ? (
                  <button className="bg-yellow-500 text-black px-3 py-1 rounded">
                    Claim
                  </button>
                ) : (
                  <span className="text-gray-500 flex items-center gap-1">
                    <Lock size={16} /> Unavailable
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
          <Sparkles size={18} />
          Note
        </h2>
        <p className="text-gray-400 text-sm">
          Badges can only be assigned by admins. You cannot request or claim
          them unless allowed by a special event or role.
        </p>
      </div>
    </main>
  );
}
