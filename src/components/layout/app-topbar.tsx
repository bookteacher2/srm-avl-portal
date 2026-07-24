"use client";

import { useRouter } from "next/navigation";
import { Bell, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MobileNav } from "./mobile-nav";
import { useAuth } from "@/providers/auth-provider";
import { ROLE_LABELS } from "@/lib/labels";
import { initials } from "@/lib/utils";
import type { NavItem } from "@/config/navigation";

export function AppTopbar({ title, items }: { title: string; items: NavItem[] }) {
  const { user, signOut } = useAuth();
  const router = useRouter();

  function handleSignOut() {
    signOut();
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/80 px-4 backdrop-blur sm:px-5">
      <div className="flex items-center gap-2">
        <MobileNav items={items} />
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
        </Button>
        {user ? (
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium leading-tight">{user.name}</p>
              <Badge variant="muted" className="mt-0.5">
                {ROLE_LABELS[user.role]}
              </Badge>
            </div>
            <Avatar>
              <AvatarFallback>{initials(user.name)}</AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="icon" aria-label="Sign out" onClick={handleSignOut}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
