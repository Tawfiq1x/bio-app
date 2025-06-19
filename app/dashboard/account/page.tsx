// app/dashboard/account/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return redirect("/login");
  }

  return (
    <main className="p-4 text-white">
      <h2 className="text-2xl font-bold mb-4">Account Details</h2>
      <p><strong>Name:</strong> {user.name || "Not set"}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Admin:</strong> {user.isAdmin ? "Yes" : "No"}</p>
    </main>
  );
}
