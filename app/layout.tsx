import "./globals.css";
import { Toaster } from "sonner";
import { Navbar } from "@/components/shared/navbar";
import { getMe } from "@/service/getMe";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getMe();

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <Navbar user={user} />
        <div className="flex-1">{children}</div>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}