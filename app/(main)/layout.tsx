"use client";

import { Navbar } from "@/components/navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="relative flex h-screen flex-col">
      <Navbar />
      {children}
    </section>
  );
}
