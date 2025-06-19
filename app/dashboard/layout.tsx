import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Bio App",
  description: "Your personal dashboard to manage your profile and settings.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen bg-[#0d0d0d] text-white">
      {/* You can add a sidebar or top navbar here if needed */}
      <div className="max-w-5xl mx-auto p-4">{children}</div>
    </section>
  );
}
