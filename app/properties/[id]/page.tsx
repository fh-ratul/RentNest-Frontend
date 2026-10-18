import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { getMe } from "@/service/getMe";
import PropertyImage from "@/components/shared/property-image";
import RequestRentalForm from "@/components/property/request-rental-form";
import StatusBadge from "@/components/shared/status-badge";
import { UserAvatar } from "@/components/shared/user-menu";
import { Button } from "@/components/ui/button";
import { PROPERTY_STATUS_TONE } from "@/lib/tones";
import { ArrowLeft, Bath, Bed, Building2, Check, Lock, MapPin, ShieldCheck, Star } from "lucide-react";
import { IPropertyDetail } from "@/lib/types";
import { getPropertyById } from "../_actions/propertyDetailActions";

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [propertyResult, user] = await Promise.all([getPropertyById(id), getMe()]);

  if (!propertyResult.success) {
    notFound();
  }

  const property: IPropertyDetail = propertyResult.data;
  const isTenant = user.success && user.data.role === "TENANT";
  const isAvailable = property.status === "AVAILABLE";
  const gallery = property.images?.slice(1, 5) ?? [];
  const price = Number(property.price).toLocaleString("en-US");
  const reviews = property.reviews ?? [];
  const avgRating = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 animate-page-in sm:px-6 sm:py-10">
      <Button asChild variant="ghost" size="sm" className="-ml-2 text-muted-foreground">
        <Link href="/properties">
          <ArrowLeft className="size-4" /> All properties
        </Link>
      </Button>

      {/* Gallery */}
      <div className="grid gap-3 md:h-[480px] md:grid-cols-4 md:grid-rows-2">
        <div
          className={`relative h-72 overflow-hidden rounded-2xl bg-muted shadow-soft sm:h-96 md:row-span-2 md:h-auto ${
            gallery.length ? "md:col-span-2" : "md:col-span-4"
          }`}
        >
          <ViewTransition name={`property-image-${property.id}`} share="morph" default="none">
            <div className="absolute inset-0">
              <PropertyImage src={property.images?.[0]} alt={property.title} priority sizes="(min-width: 768px) 50vw, 100vw" />
            </div>
          </ViewTransition>
        </div>
        {gallery.length > 0 && (
          <div className="grid grid-cols-2 gap-3 md:col-span-2 md:row-span-2 md:grid-rows-2">
            {gallery.map((img, i) => (
              <div
                key={i}
                style={{ animationDelay: `${150 + i * 80}ms` }}
                className="group relative h-32 overflow-hidden rounded-2xl bg-muted animate-in fade-in zoom-in-95 fill-mode-both duration-700 sm:h-44 md:h-auto"
              >
                <PropertyImage
                  src={img}
                  alt={`${property.title} photo ${i + 2}`}
                  sizes="25vw"
                  className="transition-transform duration-700 ease-(--ease-out-expo) group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-10">
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-3 fill-mode-both delay-150 duration-700">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={property.status} tone={PROPERTY_STATUS_TONE[property.status]} />
              {property.category && (
                <span className="rounded-full border bg-card px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                  {property.category.name}
                </span>
              )}
              {reviews.length > 0 && (
                <span className="flex items-center gap-1 text-sm font-semibold">
                  <Star className="size-4 fill-warning text-warning" /> {avgRating.toFixed(1)}
                  <span className="font-normal text-muted-foreground">
                    ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
                  </span>
                </span>
              )}
            </div>
            <h1 className="text-3xl font-medium sm:text-4xl">{property.title}</h1>
            <p className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="size-4 shrink-0 text-brass-ink" /> {property.address}, {property.city}
            </p>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <Fact icon={Bed} label="Bedrooms" value={property.bedrooms} />
              <Fact icon={Bath} label="Bathrooms" value={property.bathrooms} />
              <Fact icon={Building2} label="Type" value={property.category?.name ?? "Home"} />
            </div>
          </div>

          <Section title="About this home">
            <p className="whitespace-pre-line leading-relaxed text-muted-foreground">{property.description}</p>
          </Section>

          {property.amenities?.length > 0 && (
            <Section title="What this place offers">
              <ul className="grid gap-3 sm:grid-cols-2">
                {property.amenities.map((a) => (
                  <li key={a} className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3 text-sm font-medium">
                    <span className="flex size-6 items-center justify-center rounded-full bg-accent text-accent-foreground">
                      <Check className="size-3.5" />
                    </span>
                    {a}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {reviews.length > 0 && (
            <Section title="What tenants say">
              <div className="grid gap-4 sm:grid-cols-2">
                {reviews.map((review) => (
                  <figure key={review.id} className="space-y-3 rounded-2xl border bg-card p-5 shadow-soft">
                    <div className="flex gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          className={n <= review.rating ? "size-4 fill-warning text-warning" : "size-4 text-muted-foreground/30"}
                        />
                      ))}
                    </div>
                    {review.comment && (
                      <blockquote className="text-sm leading-relaxed text-muted-foreground">“{review.comment}”</blockquote>
                    )}
                    <figcaption className="flex items-center gap-2.5 text-sm font-medium">
                      <UserAvatar name={review.tenant.name} className="size-7" />
                      {review.tenant.name}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </Section>
          )}

          <Section title="Hosted by">
            <div className="flex items-center gap-4 rounded-2xl border bg-card p-5 shadow-soft">
              <UserAvatar name={property.landlord.name} className="size-12" />
              <div>
                <p className="font-semibold">{property.landlord.name}</p>
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <ShieldCheck className="size-3.5 text-success" /> Verified landlord
                </p>
              </div>
            </div>
          </Section>
        </div>

        {/* Booking card */}
        <aside>
          <div className="sticky top-24 overflow-hidden rounded-2xl border bg-card shadow-lift animate-in fade-in slide-in-from-bottom-4 fill-mode-both delay-300 duration-700">
            <div className="border-b bg-linear-to-br from-accent/70 to-transparent p-6">
              <p className="text-sm text-muted-foreground">Monthly rent</p>
              <p className="mt-1 font-heading text-4xl font-medium tracking-tight">
                ${price}
                <span className="font-sans text-base font-normal text-muted-foreground"> / month</span>
              </p>
            </div>
            <div className="space-y-4 p-6">
              {!isAvailable ? (
                <Notice>This property is not currently available.</Notice>
              ) : isTenant ? (
                <RequestRentalForm propertyId={property.id} />
              ) : user.success ? (
                <Notice>Only tenants can request to rent a property.</Notice>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">Log in as a tenant to request this property.</p>
                  <Button asChild size="lg" className="w-full">
                    <Link href={`/login?redirectTo=/properties/${property.id}`}>Log in to request</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="w-full">
                    <Link href="/register">Create an account</Link>
                  </Button>
                </div>
              )}
              <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <Lock className="size-3" /> You won&apos;t be charged until the landlord approves
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Fact({ icon: Icon, label, value }: { icon: typeof Bed; label: string; value: string | number }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <Icon className="size-5 text-brass-ink" strokeWidth={1.5} />
      <p className="mt-3 truncate font-heading text-xl font-medium">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 border-t pt-8">
      <h2 className="text-2xl font-normal">{title}</h2>
      {children}
    </section>
  );
}

function Notice({ children }: { children: React.ReactNode }) {
  return <p className="rounded-2xl border border-dashed bg-muted/50 p-4 text-center text-sm text-muted-foreground">{children}</p>;
}
