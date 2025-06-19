import prisma from "@/lib/prisma";

interface ProfilePageProps {
  params: { username: string };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const user = await prisma.user.findUnique({
    where: { username: params.username },
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
    return (
      <div className="p-6 text-white">
        <h1 className="text-3xl font-bold">User not found</h1>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg max-w-3xl mx-auto">
      <header className="mb-6">
        <h1 className="text-4xl font-bold">{user.name || user.username}</h1>
        <p>{user.profile?.bio}</p>
      </header>
      <section className="flex items-center gap-4 mb-6">
        <img
          src={user.profile?.avatar || '/default-avatar.png'}
          alt={`${user.username} avatar`}
          className="w-24 h-24 rounded-full"
        />
        <div className="flex gap-2">
          {user.userBadges.map((ub) => (
            <img
              key={ub.badge.id}
              src={ub.badge.icon}
              alt={ub.badge.name}
              title={ub.badge.name}
              className="w-8 h-8"
            />
          ))}
        </div>
      </section>
      <section>
        {/* Add social links and other info */}
      </section>
    </div>
  );
}
