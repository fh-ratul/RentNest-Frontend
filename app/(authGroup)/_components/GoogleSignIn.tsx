"use client";

import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { useTheme } from "@/components/theme/theme-provider";
import { googleLoginAction } from "../_actions/authActions";

// The slice of Google Identity Services this component uses.
type GoogleAccounts = {
  id: {
    initialize: (options: {
      client_id: string;
      callback: (response: { credential?: string }) => void;
      ux_mode?: "popup";
    }) => void;
    renderButton: (
      parent: HTMLElement,
      options: {
        theme: string;
        size: string;
        text: string;
        shape: string;
        width: number;
        locale?: string;
      }
    ) => void;
  };
};

declare global {
  interface Window {
    google?: { accounts: GoogleAccounts };
  }
}

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

type GoogleSignInProps = {
  // Sent from the register page only: a new Google account needs a role.
  role?: "TENANT" | "LANDLORD";
  text?: "continue_with" | "signup_with";
};

// Google signs the visitor in and hands the browser an ID token; the server
// action passes it to the backend, which verifies it and issues its own tokens.
// Rendered only when a Google client id is configured.
const GoogleSignIn = ({ role, text = "continue_with" }: GoogleSignInProps) => {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "";
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isScriptReady, setScriptReady] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { resolvedTheme } = useTheme();

  // Google keeps the callback from the first initialize, so it reads the
  // role picked most recently through a ref.
  const roleRef = useRef(role);
  useEffect(() => {
    roleRef.current = role;
  }, [role]);

  const handleCredential = useCallback(
    (credential: string | undefined) => {
      if (!credential) {
        toast.error("Google did not return a sign-in token. Please try again.");
        return;
      }

      startTransition(async () => {
        const result = await googleLoginAction(credential, roleRef.current, redirectTo);

        if (result && !result.success) {
          toast.error(result.message || "Google login failed");
        }
      });
    },
    [redirectTo]
  );

  useEffect(() => {
    const container = buttonRef.current;

    if (!isScriptReady || !CLIENT_ID || !window.google || !container) {
      return;
    }

    window.google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: (response) => handleCredential(response.credential),
      ux_mode: "popup",
    });
    window.google.accounts.id.renderButton(container, {
      theme: resolvedTheme === "dark" ? "filled_black" : "outline",
      size: "large",
      text,
      shape: "rectangular",
      width: Math.min(container.offsetWidth || 320, 400),
      // The rest of the page is in English; without this Google follows the browser.
      locale: "en",
    });
  }, [handleCredential, isScriptReady, text, resolvedTheme]);

  if (!CLIENT_ID) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-xs uppercase text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>
      <div className="flex min-h-11 flex-col items-center justify-center">
        <Script
          src="https://accounts.google.com/gsi/client?hl=en"
          strategy="afterInteractive"
          onReady={() => setScriptReady(true)}
        />
        {isPending && (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Signing in with Google...
          </p>
        )}
        {/* Google draws its own button into this element, inside a light-scheme iframe.
            In dark mode the page's color-scheme would differ from the iframe's, and the
            browser then paints an opaque white box behind it; matching the scheme here
            keeps the iframe transparent. */}
        <div
          ref={buttonRef}
          style={{ colorScheme: "light" }}
          className={isPending ? "hidden" : "flex w-full justify-center"}
        />
      </div>
      {role && (
        <p className="text-center text-xs text-muted-foreground">
          Signing up with Google creates a {role === "TENANT" ? "tenant" : "landlord"} account. Pick
          your role above first.
        </p>
      )}
    </div>
  );
};

export default GoogleSignIn;
