"use client";

import { QueryClientProvider as QP, QueryClient } from "@tanstack/react-query";
import { ReactNode } from "react";

const client = new QueryClient();

export default function QueryClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  return <QP client={client}>{children}</QP>;
}
