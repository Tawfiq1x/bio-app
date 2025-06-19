// app/dashboard/customize/layout.tsx
import React, { ReactNode } from "react";

export default function CustomizeLayout({ children }: { children: ReactNode }) {
  return (
    <section className="dashboard-customize-layout p-6 bg-gray-900 min-h-screen text-white">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Customize Dashboard</h1>
        <p className="text-gray-400">Update your profile appearance and settings here.</p>
      </header>
      <div>{children}</div>
    </section>
  );
}
