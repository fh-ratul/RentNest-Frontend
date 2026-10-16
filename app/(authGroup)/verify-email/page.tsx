import VerifyEmailForm from "../_components/VerifyEmailForm";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email = "" } = await searchParams;

  return (
    <div className="w-full max-w-md space-y-6 rounded-lg border p-8 shadow-lg">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Verify Your Email</h1>
        <p className="text-gray-500">
          {email ? (
            <>
              We sent a 6 digit code to <span className="font-medium text-gray-900">{email}</span>
            </>
          ) : (
            "Enter your email and the 6 digit code we sent you"
          )}
        </p>
      </div>
      <VerifyEmailForm email={email} />
    </div>
  );
}
