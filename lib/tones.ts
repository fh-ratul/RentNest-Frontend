// Soft, theme-aware color treatments built on the semantic tokens in globals.css.
// Each reads well on both the light and dark background.
export const TONES = {
  success: "border-success/25 bg-success/10 text-success",
  warning: "border-warning/30 bg-warning/12 text-warning",
  info: "border-info/25 bg-info/10 text-info",
  danger: "border-destructive/25 bg-destructive/10 text-destructive",
  violet: "border-violet/25 bg-violet/10 text-violet",
  brand: "border-primary/25 bg-primary/10 text-primary",
  neutral: "border-border bg-muted text-muted-foreground",
} as const;

export type Tone = keyof typeof TONES;

export const RENTAL_STATUS_TONE: Record<string, Tone> = {
  PENDING: "warning",
  APPROVED: "info",
  REJECTED: "danger",
  ACTIVE: "success",
  COMPLETED: "neutral",
};

export const PAYMENT_STATUS_TONE: Record<string, Tone> = {
  COMPLETED: "success",
  PENDING: "warning",
  FAILED: "danger",
};

export const PROPERTY_STATUS_TONE: Record<string, Tone> = {
  AVAILABLE: "success",
  RENTED: "info",
  INACTIVE: "neutral",
};

export const ROLE_TONE: Record<string, Tone> = {
  ADMIN: "violet",
  LANDLORD: "info",
  TENANT: "brand",
};

// Solid dot color for the same tones, used in badges.
export const TONE_DOT: Record<Tone, string> = {
  success: "bg-success",
  warning: "bg-warning",
  info: "bg-info",
  danger: "bg-destructive",
  violet: "bg-violet",
  brand: "bg-primary",
  neutral: "bg-muted-foreground/60",
};
