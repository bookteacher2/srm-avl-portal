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
import { Logo } from "@/components/shared/logo";
import { useAuth } from "@/providers/auth-provider";
import { homeForRole } from "@/config/navigation";

/**
 * Sign-in page.
 *
 * Demo quick-login buttons have been removed per the agreed design. The mock
 * `authService.authenticate(email)` still backs this form (no password check in
 * the prototype). When Tech wires Auth.js, only the auth provider changes — this
 * page keeps submitting email + password.
 */
export default function LoginPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleLogin(withEmail: string) {
    setBusy(true);
    const session = await signIn(withEmail);
    setBusy(false);
    if (!session) {
      toast.error("Account not found", {
        description: "Check your email address and try again.",
      });
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

            <p className="text-center text-sm text-muted-foreground">
              New supplier?{" "}
              <Link href="/register" className="font-medium text-primary hover:underline">
                Register here
              </Link>
            </p>
            <p className="text-center text-xs text-muted-foreground">
              Want to check an existing application?{" "}
              <Link href="/status" className="font-medium text-primary hover:underline">
                Track by Application ID
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
