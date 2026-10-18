import Link from "next/link";
import { Button } from "@/components/ui/button";
import StatusScreen from "@/components/shared/status-screen";
import { Home, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <StatusScreen
      icon={SearchX}
      eyebrow="404"
      title="Page not found"
      description="The page you're looking for doesn't exist or you don't have access to it."
    >
      <Button asChild variant="outline" size="lg">
        <Link href="/properties">Browse properties</Link>
      </Button>
      <Button asChild size="lg">
        <Link href="/">
          <Home className="size-4" /> Go home
        </Link>
      </Button>
    </StatusScreen>
  );
}
