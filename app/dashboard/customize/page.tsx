// app/dashboard/customize/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function CustomizePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return redirect("/login");
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  });

  return (
    <main className="p-4 text-white">
      <h2 className="text-2xl font-bold mb-4">Customize Your Profile</h2>
      <form>
        <label className="block mb-2">
          Bio:
          <textarea
            defaultValue={profile?.bio || ""}
            className="w-full p-2 mt-1 rounded bg-gray-800 text-white"
            rows={4}
          />
        </label>
        <label className="block mb-2">
          Avatar URL:
          <input
            type="text"
            defaultValue={profile?.avatar || ""}
            className="w-full p-2 mt-1 rounded bg-gray-800 text-white"
          />
        </label>
        <label className="block mb-2">
          Banner URL:
          <input
            type="text"
            defaultValue={profile?.banner || ""}
            className="w-full p-2 mt-1 rounded bg-gray-800 text-white"
          />
        </label>
        <label className="block mb-2">
          Music URL:
          <input
            type="text"
            defaultValue={profile?.music || ""}
            className="w-full p-2 mt-1 rounded bg-gray-800 text-white"
          />
        </label>
        {/* You can add more customization fields here */}
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </main>
  );
}
