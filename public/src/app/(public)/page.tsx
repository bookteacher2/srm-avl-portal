import Link from "next/link";
import {
  ArrowRight,
  Download,
  ShieldCheck,
  Zap,
  TrendingUp,
  Handshake,
  CheckCircle2,
  Sun,
  Package,
  Wrench,
  Mail,
  Phone,
  MapPin,
  PlayCircle,
  FileText,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/shared/reveal";
import { configService } from "@/lib/services";

const WHY = [
  { icon: TrendingUp, title: "Consistent Pipeline", body: "Access a steady flow of Solar EPC and EV infrastructure projects across Thailand." },
  { icon: ShieldCheck, title: "Fair Governance", body: "A transparent, criteria-based qualification process — no hidden barriers." },
  { icon: Zap, title: "Fast Onboarding", body: "A streamlined digital registration designed for growing contractors, not paperwork." },
  { icon: Handshake, title: "Long-term Partnership", body: "Strong performers grow with us through repeat awards and preferred status." },
];

const PROCESS = [
  "Register & Select Category",
  "Book Thursday Presentation",
  "Presentation & Assessment",
  "Decision (Qualified)",
  "Upload Documents",
  "AVL Approval",
];

const FAQ = [
  { q: "Who can register?", a: "Contractors, Product Suppliers and Service Providers for Solar EPC and EV infrastructure can all register today." },
  { q: "Do I need to upload documents to register?", a: "No. Registration is lightweight — only company details, contacts, category and your Company Profile. The full document set is requested later, after your presentation and a Qualified decision." },
  { q: "How long does approval take?", a: "A typical cycle runs 4–8 weeks depending on presentation scheduling and how quickly documents are provided after qualification." },
  { q: "Is there a registration fee?", a: "No. Registration and qualification for the Approved Vendor List are free of charge." },
  { q: "How do I check my status?", a: "Use the public Track Application page with your Application ID (e.g. APP-2026-0142) — no login required." },
];

const TYPE_ICONS: Record<string, typeof Sun> = {
  CONTRACTOR: Wrench,
  PRODUCT: Package,
  SERVICE: Handshake,
};

export default async function LandingPage() {
  const supplierTypes = await configService.supplierTypes();

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-accent/60 to-background">
        <div className="container grid gap-10 py-20 lg:grid-cols-2 lg:py-28">
          <div className="flex flex-col justify-center">
            <Badge variant="default" className="mb-5 w-fit">Approved Vendor Program · 2026</Badge>
            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
              Become Our Supplier
            </h1>
            <p className="mt-4 max-w-lg text-lg text-muted-foreground">
              Join our approved vendor network for Solar EPC and EV Infrastructure —
              open to Contractors, Product Suppliers and Service Providers. A modern,
              transparent qualification built for growing partners.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link href="/register">
                  Register <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button size="lg" variant="ghost" asChild>
                <Link href="/status">
                  <Search className="h-4 w-4" /> Track Application
                </Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {["No registration fee", "4–8 week cycle", "Transparent scoring"].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-success" /> {t}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center">
            <Card className="w-full max-w-md">
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Sun className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">Who Can Apply</p>
                    <p className="text-sm text-muted-foreground">Open to all supplier types</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { t: "Contractor", d: "EPC & installation for Solar and EV projects" },
                    { t: "Product Supplier", d: "Panels, inverters, chargers, cabling and more" },
                    { t: "Service Provider", d: "Consultancy, testing, logistics, O&M services" },
                  ].map((row) => (
                    <div key={row.t} className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      <div>
                        <p className="text-sm font-medium">{row.t}</p>
                        <p className="text-xs text-muted-foreground">{row.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-lg border border-border p-4 text-sm">
                  <p className="font-medium">Solar EPC · EV Charger · O&amp;M</p>
                  <p className="mt-1 text-muted-foreground">
                    A transparent, criteria-based path to becoming an approved 24X vendor.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why */}
      <section id="why" className="container py-20">
        <SectionHeading eyebrow="Why Partner" title="Why Become Our Supplier" />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {WHY.map(({ icon: Icon, title, body }, i) => (
            <Reveal key={title} delay={i * 0.08}>
              <Card className="h-full transition-shadow hover:shadow-card">
                <CardContent className="p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-semibold">{title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="border-y border-border bg-muted/30 py-20">
        <div className="container">
          <SectionHeading eyebrow="Supplier Categories" title="Who We Onboard" />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {supplierTypes.map((type) => {
              const Icon = TYPE_ICONS[type.code] ?? Wrench;
              const live = type.status === "LIVE";
              return (
                <Reveal key={type.id} delay={type.sortOrder * 0.08} className="h-full">
                <Card className={live ? "h-full ring-1 ring-primary/20 transition-shadow hover:shadow-card" : "h-full opacity-80"}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <Badge variant={live ? "success" : "muted"}>
                        {live ? "Now Open" : "Coming Soon"}
                      </Badge>
                    </div>
                    <h3 className="mt-4 font-semibold">{type.label}</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">{type.description}</p>
                    {live ? (
                      <Button variant="link" className="mt-3 px-0" asChild>
                        <Link href="/register">
                          Start registration <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    ) : null}
                  </CardContent>
                </Card>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="container py-20">
        <SectionHeading eyebrow="Registration Process" title="Six Steps to Approval" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-6">
          {PROCESS.map((step, i) => (
            <div key={step} className="relative flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
                {i + 1}
              </div>
              {i < PROCESS.length - 1 ? (
                <div className="absolute left-1/2 top-6 hidden h-px w-full bg-border lg:block" />
              ) : null}
              <p className="mt-3 text-sm font-medium">{step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Onboarding video + resources */}
      <section id="learn" className="container py-20">
        <SectionHeading eyebrow="Get Started" title="How Vendor Onboarding Works" />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <Reveal className="lg:col-span-2">
            <div className="group relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 to-accent/40">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-card transition-transform group-hover:scale-105">
                  <PlayCircle className="h-8 w-8" />
                </div>
                <p className="mt-4 font-medium">Onboarding Overview (2 min)</p>
                <p className="text-sm text-muted-foreground">Video placeholder — embed the 24X onboarding walkthrough here.</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Card className="flex h-full flex-col justify-between">
              <CardContent className="p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold">Supplier Code of Conduct</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Review our ethics, HSE, quality and anti-corruption expectations. Acknowledged during registration.
                </p>
                <Button variant="outline" className="mt-4" asChild>
                  <a href="/downloads/Supplier_Code_of_Conduct.txt" download>
                    <Download className="h-4 w-4" /> Download
                  </a>
                </Button>
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-y border-border bg-muted/30 py-20">
        <div className="container max-w-3xl">
          <SectionHeading eyebrow="FAQ" title="Frequently Asked Questions" />
          <div className="mt-8 space-y-4">
            {FAQ.map((item) => (
              <Card key={item.q}>
                <CardContent className="p-6">
                  <h3 className="font-semibold">{item.q}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{item.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="container py-20">
        <Card className="overflow-hidden">
          <div className="grid gap-8 p-8 md:grid-cols-2 lg:p-12">
            <div>
              <SectionHeading eyebrow="Contact Procurement" title="Talk to our team" align="left" />
              <p className="mt-3 max-w-md text-sm text-muted-foreground">
                Questions about registration or the Approved Vendor List? Our procurement
                team is here to help.
              </p>
              <div className="mt-6 space-y-3 text-sm">
                <p className="flex items-center gap-3"><Mail className="h-4 w-4 text-primary" /> procurement@epc-portal.co.th</p>
                <p className="flex items-center gap-3"><Phone className="h-4 w-4 text-primary" /> +66 2 000 0000</p>
                <p className="flex items-center gap-3"><MapPin className="h-4 w-4 text-primary" /> Bangkok, Thailand</p>
              </div>
            </div>
            <div className="flex flex-col justify-center gap-3 rounded-xl bg-primary/5 p-6">
              <p className="font-semibold">Ready to get started?</p>
              <p className="text-sm text-muted-foreground">
                Create your supplier account and complete registration online.
              </p>
              <Button asChild className="mt-2 w-fit">
                <Link href="/register">
                  Register now <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      <p className="text-sm font-semibold uppercase tracking-wide text-primary">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-bold tracking-tight">{title}</h2>
    </div>
  );
}
