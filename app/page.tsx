import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import PropertyCard from "@/components/property/property-card";
import HeroSearch from "@/components/home/hero-search";
import HowItWorks from "@/components/home/how-it-works";
import StatStrip from "@/components/home/stat-stripe";
import { Reveal } from "@/components/motion/reveal";
import EmptyState from "@/components/shared/empty-state";
import { getProperties } from "./properties/_actions/propertyActions";
import { IProperty } from "@/lib/types";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Check,
  CreditCard,
  Home,
  Landmark,
  MessagesSquare,
  Mountain,
  ReceiptText,
  Waves,
} from "lucide-react";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=80";
const INTERIOR_IMAGE =
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80";

const VALUES = [
  { icon: BadgeCheck, title: "Verified listings", text: "Every home is listed by a registered landlord account." },
  { icon: CreditCard, title: "Secure payments", text: "Rent is paid online through Stripe. No cash changes hands." },
  { icon: MessagesSquare, title: "Direct with owners", text: "Send requests and get decisions straight from the landlord." },
  { icon: ReceiptText, title: "Clear pricing", text: "The monthly rent is shown up front on every listing." },
];

const CITIES = [
  { name: "Dhaka", blurb: "The capital's most sought-after neighbourhoods.", icon: Landmark },
  { name: "Chattogram", blurb: "Port-city living between the hills and the sea.", icon: Waves },
  { name: "Sylhet", blurb: "Quiet, green and surrounded by tea gardens.", icon: Mountain },
];

const LANDLORD_POINTS = [
  "Publish a listing in minutes, with photos and amenities",
  "Approve or decline tenant requests from one inbox",
  "Tenants pay online before the lease begins",
  "Track listings, active leases and earnings in your dashboard",
];

export default async function HomePage() {
  const featuredResult = await getProperties({ limit: "6" });
  const properties: IProperty[] = featuredResult.success ? featuredResult.data : [];
  const totalListings = featuredResult.meta?.total ?? properties.length;

  return (
    <div className="animate-page-in">
      {/* Hero */}
      <section className="px-3 pt-3 sm:px-4 sm:pt-4">
        <div className="relative isolate flex min-h-[620px] items-end overflow-hidden rounded-2xl bg-[var(--navy)] lg:min-h-[min(780px,calc(100svh-7.5rem))]">
          <Image
            src={HERO_IMAGE}
            alt="A modern two-storey home lit up at dusk"
            fill
            priority
            sizes="100vw"
            className="-z-20 object-cover animate-hero-zoom"
          />
          <div className="absolute inset-0 -z-10 bg-linear-to-r from-[oklch(0.17_0.04_258/0.9)] via-[oklch(0.17_0.04_258/0.55)] to-[oklch(0.17_0.04_258/0.1)]" />
          <div className="absolute inset-0 -z-10 bg-linear-to-t from-[oklch(0.15_0.04_258/0.85)] via-transparent to-transparent" />

          <div className="mx-auto w-full max-w-7xl px-6 pb-10 pt-28 sm:px-10 sm:pb-14 lg:pb-16">
            <p className="eyebrow text-[oklch(0.82_0.08_80)]! animate-in fade-in slide-in-from-bottom-3 fill-mode-both duration-700">
              RentNest · Verified rentals
            </p>
            <h1 className="mt-5 max-w-3xl text-[2.9rem] font-normal leading-[1.02] tracking-[-0.025em] text-white animate-in fade-in slide-in-from-bottom-4 fill-mode-both delay-100 duration-700 sm:text-6xl lg:text-[5.25rem]">
              Homes worth <em className="font-light text-[oklch(0.84_0.08_80)]">coming home</em> to.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75 animate-in fade-in slide-in-from-bottom-4 fill-mode-both delay-200 duration-700">
              Verified rental homes across Bangladesh. Request, get approved and pay securely online, all in one
              place.
            </p>
            <div className="mt-10 animate-in fade-in slide-in-from-bottom-4 fill-mode-both delay-300 duration-700">
              <HeroSearch />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <StatStrip
          stats={[
            { value: totalListings, suffix: "+", label: "Homes available", hint: "Listed by verified landlords" },
            { value: 3, label: "Cities covered", hint: "Dhaka, Chattogram and Sylhet" },
            { value: 100, suffix: "%", label: "Online payments", hint: "Processed securely by Stripe" },
          ]}
        />
      </section>

      {/* Featured properties */}
      <section className="border-t">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
          <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Featured residences</p>
              <h2 className="mt-4 max-w-2xl text-4xl font-normal leading-[1.08] sm:text-5xl">
                Handpicked homes, <em className="font-light text-brass-ink">available now</em>
              </h2>
            </div>
            <ArrowLink href="/properties">View all homes</ArrowLink>
          </Reveal>

          {properties.length === 0 ? (
            <EmptyState icon={Home} title="No homes listed yet" description="New listings are on their way. Check back soon." />
          ) : (
            <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((property, i) => (
                <Reveal key={property.id} delay={(i % 3) * 90}>
                  <PropertyCard property={property} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why RentNest */}
      <section className="bg-secondary/70">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-24">
          <Reveal className="grid gap-10 lg:grid-cols-[0.9fr_2fr] lg:gap-16">
            <div>
              <p className="eyebrow">Why RentNest</p>
              <h2 className="mt-4 text-4xl font-normal leading-[1.08] sm:text-5xl">
                Renting, <em className="font-light text-brass-ink">handled properly.</em>
              </h2>
            </div>
            <div className="grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2">
              {VALUES.map((v) => (
                <div key={v.title} className="group bg-card p-7 transition-colors duration-300 hover:bg-background">
                  <v.icon className="size-6 text-brass-ink transition-transform duration-500 ease-(--ease-out-expo) group-hover:-translate-y-0.5" strokeWidth={1.5} />
                  <h3 className="mt-5 text-xl font-medium">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.text}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Cities */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
        <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Explore by city</p>
            <h2 className="mt-4 text-4xl font-normal leading-[1.08] sm:text-5xl">
              Where would you <em className="font-light text-brass-ink">like to live?</em>
            </h2>
          </div>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-3">
          {CITIES.map((city, i) => (
            <Reveal key={city.name} delay={i * 100}>
              <Link
                href={`/properties?city=${city.name}`}
                className="group relative flex h-80 flex-col justify-between overflow-hidden rounded-xl bg-[var(--navy)] p-7 text-white outline-none ring-1 ring-inset ring-white/0 transition-shadow dark:bg-card dark:ring-white/10 dark:hover:ring-[oklch(0.82_0.08_80/0.4)] focus-visible:ring-3 focus-visible:ring-ring/40"
              >
                <city.icon
                  aria-hidden
                  strokeWidth={0.75}
                  className="absolute -bottom-10 -right-10 size-64 text-white/[0.06] transition-transform duration-[1200ms] ease-(--ease-out-expo) group-hover:-translate-x-3 group-hover:-translate-y-3"
                />
                <div className="relative flex items-center justify-between">
                  <span className="font-heading text-lg italic text-[oklch(0.82_0.08_80)]">0{i + 1}</span>
                  <span className="flex size-10 items-center justify-center rounded-full border border-white/20 transition-colors duration-300 group-hover:border-[oklch(0.82_0.08_80)] group-hover:bg-[oklch(0.82_0.08_80)] group-hover:text-[oklch(0.2_0.03_258)]">
                    <ArrowUpRight className="size-4" />
                  </span>
                </div>
                <div className="relative">
                  <h3 className="text-4xl font-normal">{city.name}</h3>
                  <p className="mt-2 max-w-[16rem] text-sm text-white/65">{city.blurb}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y bg-card">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
          <Reveal className="mb-14 max-w-2xl">
            <p className="eyebrow">How it works</p>
            <h2 className="mt-4 text-4xl font-normal leading-[1.08] sm:text-5xl">
              From first viewing to <em className="font-light text-brass-ink">keys in hand.</em>
            </h2>
          </Reveal>
          <HowItWorks />
        </div>
      </section>

      {/* For landlords */}
      <section id="landlords" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted sm:aspect-[5/5]">
              <Image
                src={INTERIOR_IMAGE}
                alt="A bright open-plan living room with a sofa and kitchen"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 right-4 max-w-[17rem] rounded-xl border bg-card p-5 shadow-lift sm:-right-6">
              <p className="eyebrow text-[0.62rem]!">Landlord dashboard</p>
              <p className="mt-2 font-heading text-xl leading-snug">Requests, leases and payments in one place.</p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <p className="eyebrow">For property owners</p>
            <h2 className="mt-4 text-4xl font-normal leading-[1.08] sm:text-5xl">
              List with confidence. <em className="font-light text-brass-ink">Get paid on time.</em>
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
              Reach tenants who are ready to move, and manage every request, lease and payment from a single,
              focused dashboard.
            </p>
            <ul className="mt-8 divide-y border-y">
              {LANDLORD_POINTS.map((point) => (
                <li key={point} className="flex items-center gap-4 py-4">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <Check className="size-3.5" />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild size="lg" className="group h-12 px-6">
                <Link href="/register">
                  List your property <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-6">
                <Link href="/login">Landlord sign in</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="px-3 pb-3 sm:px-4 sm:pb-4">
        <Reveal className="relative overflow-hidden rounded-2xl bg-[var(--navy)] px-6 py-20 text-center text-white sm:px-12 sm:py-24">
          <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[oklch(0.82_0.08_80/0.6)] to-transparent" />
          <div className="relative mx-auto max-w-2xl">
            <p className="eyebrow text-[oklch(0.82_0.08_80)]!">Start today</p>
            <h2 className="mt-5 text-4xl font-normal leading-[1.08] sm:text-6xl">
              Your next home is <em className="font-light text-[oklch(0.84_0.08_80)]">waiting.</em>
            </h2>
            <p className="mt-5 text-lg text-white/70">
              Browse verified homes today, or list your property and reach tenants who are ready to move.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="group h-12 bg-[oklch(0.82_0.08_80)] px-7 text-[oklch(0.2_0.03_258)] hover:bg-[oklch(0.86_0.07_80)]"
              >
                <Link href="/properties">
                  Browse homes <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 border-white/25 bg-transparent px-7 text-white hover:bg-white/10 hover:text-white dark:bg-transparent"
              >
                <Link href="/register">Create a free account</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

function ArrowLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 border-b border-foreground/30 pb-1 text-sm font-semibold transition-colors hover:border-brass"
    >
      {children}
      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );
}
