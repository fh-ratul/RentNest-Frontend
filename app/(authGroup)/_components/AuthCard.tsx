import Link from "next/link";

type AuthCardProps = {
  title: string;
  description: React.ReactNode;
  children: React.ReactNode;
  footer?: { text: string; linkLabel: string; href: string };
};

const AuthCard = ({ title, description, children, footer }: AuthCardProps) => {
  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border bg-card p-6 shadow-soft sm:p-9">
        <div className="mb-8">
          <p className="eyebrow">RentNest account</p>
          <h1 className="mt-3 text-4xl font-normal">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="space-y-6">{children}</div>
      </div>
      {footer && (
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {footer.text}{" "}
          <Link href={footer.href} className="font-semibold text-foreground underline decoration-brass underline-offset-4 hover:decoration-2">
            {footer.linkLabel}
          </Link>
        </p>
      )}
    </div>
  );
};

export default AuthCard;
