import { redirect } from "next/navigation";
import { KeyRound, Palette, UserRound } from "lucide-react";
import { getMe } from "@/service/getMe";
import { PageHeader, Panel } from "@/components/dashboard/page-header";
import { ThemePicker } from "@/components/theme/theme-picker";
import UpdateProfileForm from "./update-profile-form";
import ChangePasswordForm from "./change-password-form";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const user = await getMe();

  if (!user.success) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader title="Settings" description="Manage your account details and preferences." />

      <SettingsSection icon={UserRound} title="Profile" description="Update the name shown to landlords and tenants.">
        <UpdateProfileForm currentName={user.data.name} />
      </SettingsSection>

      <SettingsSection icon={Palette} title="Appearance" description="Choose how RentNest looks on this device.">
        <ThemePicker />
      </SettingsSection>

      <SettingsSection icon={KeyRound} title="Password" description="Change your account password.">
        <ChangePasswordForm />
      </SettingsSection>
    </div>
  );
}

function SettingsSection({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof UserRound;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Panel className="grid gap-6 p-5 sm:p-7 md:grid-cols-[220px_1fr]">
      <div className="space-y-2">
        <span className="flex size-9 items-center justify-center rounded-xl bg-accent text-accent-foreground">
          <Icon className="size-4" />
        </span>
        <h2 className="font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div>{children}</div>
    </Panel>
  );
}
