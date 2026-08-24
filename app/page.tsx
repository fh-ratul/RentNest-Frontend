import Link from "next/link";
import { Button } from "@/components/ui/button";
import PropertyCard from "@/components/property/property-card";
import HeroSearch from "@/components/home/hero-search";
import HowItWorks from "@/components/home/how-it-works";
import { Separator } from "@/components/ui/separator";
import { getProperties } from "./properties/_actions/propertyActions";
import { IProperty } from "@/lib/types";
import { ArrowRight } from "lucide-react";
import StatStrip from "@/components/home/stat-stripe";

export default async function HomePage() {
  const featuredResult = await getProperties({ limit: "6" });
  const properties: IProperty[] = featuredResult.success ? featuredResult.data : [];
  const totalListings = featuredResult.meta?.total ?? properties.length;

  return (
    <div>
      {/* Hero */}
<section className="relative overflow-hidden border-b bg-gradient-to-b from-muted/60 to-background">
  <div
    className="absolute inset-0 opacity-[0.4]"
    style={{
      backgroundImage:
        "radial-gradient(circle at 1px 1px, hsl(var(--foreground)/0.15) 1px, transparent 0)",
      backgroundSize: "28px 28px",
    }}
  />
  <div className="relative mx-auto max-w-4xl px-4 pb-16 pt-24 text-center">
    <span className="inline-flex items-center rounded-full border bg-background px-4 py-1 text-xs font-medium text-muted-foreground shadow-sm">
      🏠 Bangladesh&apos;s modern rental marketplace
    </span>
    <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl">
      Find your next home,
      <br />
      <span className="text-primary">without the hassle.</span>
    </h1>
    <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
      Browse verified listings, request to rent, and pay securely online —
      all in one place.
    </p>
    <div className="mt-8">
      <HeroSearch />
    </div>
    <div className="mt-6 flex justify-center gap-3">
      <Button asChild variant="outline">
        <Link href="/register">
          List Your Property <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  </div>
</section>

{/* Stats */}
<section className="border-b bg-card">
  <div className="mx-auto max-w-4xl px-4 py-10">
    <StatStrip
      stats={[
        { value: `${totalListings}+`, label: "Active Listings" },
        { value: "3", label: "Cities Covered" },
        { value: "100%", label: "Secure Payments" },
      ]}
    />
  </div>
</section>

      {/* Featured properties */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Featured Properties</h2>
            <p className="text-muted-foreground">Handpicked listings available right now.</p>
          </div>
          <Button asChild variant="ghost">
            <Link href="/properties">
              View all <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {properties.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">
            No properties available yet — check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>

      <Separator />

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-4 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-semibold">How RentNest Works</h2>
          <p className="mt-2 text-muted-foreground">Three simple steps from search to move-in.</p>
        </div>
        <HowItWorks />
      </section>

      {/* CTA */}
      <section className="border-t bg-primary py-16 text-primary-foreground">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl font-semibold sm:text-3xl">Ready to find your next home?</h2>
          <p className="mt-2 text-primary-foreground/80">
            Join hundreds of tenants and landlords already using RentNest.
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-6">
            <Link href="/properties">Start Browsing</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}