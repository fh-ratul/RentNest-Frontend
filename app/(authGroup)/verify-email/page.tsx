import { MailCheck } from "lucide-react";
import AuthCard from "../_components/AuthCard";
import VerifyEmailForm from "../_components/VerifyEmailForm";

export const metadata = { title: "Verify your email" };

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email = "" } = await searchParams;

  return (
    <AuthCard
      title="Verify your email"
      description={
        <>
          <span className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <MailCheck className="size-6" />
          </span>
          {email ? (
            <>
              We sent a 6 digit code to <span className="font-semibold text-foreground">{email}</span>
            </>
          ) : (
            "Enter your email and the 6 digit code we sent you"
          )}
        </>
      }
    >
      <VerifyEmailForm email={email} />
    </AuthCard>
  );
}
