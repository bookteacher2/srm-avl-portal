import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
            <a href="/#why" className="hover:text-foreground">Why Partner</a>
            <a href="/#categories" className="hover:text-foreground">Categories</a>
            <a href="/#process" className="hover:text-foreground">Process</a>
            <a href="/#faq" className="hover:text-foreground">FAQ</a>
            <Link href="/status" className="hover:text-foreground">Track Application</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Register</Link>
            </Button>
          </div>
        </div>
      </header>
      <div className="flex-1">{children}</div>
      <footer className="border-t border-border bg-card">
        <div className="container flex flex-col items-center justify-between gap-4 py-8 text-sm text-muted-foreground sm:flex-row">
          <Logo />
          <p>© {new Date().getFullYear()} EPC Supplier Portal. Procurement & Vendor Management.</p>
        </div>
      </footer>
    </div>
  );
}
