"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/shared/logo";
import { useAuth } from "@/providers/auth-provider";
import { useAsync } from "@/hooks/use-async";
import { authService } from "@/lib/services";
import { homeForRole } from "@/config/navigation";
import { ROLE_LABELS } from "@/lib/labels";

export default function LoginPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const { data: demoAccounts } = useAsync(() => authService.demoAccounts(), []);

  async function handleLogin(withEmail: string) {
    setBusy(true);
    const session = await signIn(withEmail);
    setBusy(false);
    if (!session) {
      toast.error("Account not found", { description: "Try one of the demo accounts below." });
      return;
    }
    toast.success(`Welcome back, ${session.name}`);
    router.push(homeForRole(session.role));
  }

  return (
    <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Sign in</CardTitle>
            <CardDescription>Access your supplier or procurement workspace.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin(email);
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.co.th"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" />
              </div>
              <Button type="submit" className="w-full" disabled={busy}>
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
                Sign in
              </Button>
            </form>

            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                or quick login (demo)
              </span>
            </div>

            <div className="grid gap-2">
              {(demoAccounts ?? []).map((acc) => (
                <button
                  key={acc.id}
                  onClick={() => handleLogin(acc.email)}
                  disabled={busy}
                  className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-left text-sm transition-colors hover:bg-muted disabled:opacity-50"
                >
                  <span>
                    <span className="font-medium">{acc.name}</span>
                    <span className="block text-xs text-muted-foreground">{acc.email}</span>
                  </span>
                  <Badge variant="muted">{ROLE_LABELS[acc.role]}</Badge>
                </button>
              ))}
            </div>

            <p className="text-center text-sm text-muted-foreground">
              New supplier?{" "}
              <Link href="/register" className="font-medium text-primary hover:underline">
                Register here
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
