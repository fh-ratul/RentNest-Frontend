import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { HideOnDashboard } from "@/components/shared/hide-on-dashboard";
import { ThemeProvider, themeScript } from "@/components/theme/theme-provider";
import { getMe } from "@/service/getMe";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "RentNest — Premium homes for rent",
    template: "%s · RentNest",
  },
  description:
    "Verified rental homes across Bangladesh. Request to rent and pay securely online with RentNest.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf8f4" },
    { media: "(prefers-color-scheme: dark)", color: "#0e141f" },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getMe();

  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-screen flex-col">
        <ThemeProvider>
          <Navbar user={user} />
          <div className="flex flex-1 flex-col">{children}</div>
          <HideOnDashboard>
            <Footer />
          </HideOnDashboard>
          <Toaster position="top-right" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
