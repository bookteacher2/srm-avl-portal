"use client";

import { AuthProvider } from "./auth-provider";
import { Toaster } from "@/components/ui/sonner";

/** App-wide client providers. Add SessionProvider / QueryClientProvider here later. */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster position="top-right" richColors />
    </AuthProvider>
  );
}
