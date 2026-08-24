import { redirect } from "next/navigation";
import { getMe } from "@/service/getMe";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import UpdateProfileForm from "./update-profile-form";
import ChangePasswordForm from "./change-password-form";


export default async function SettingsPage() {
  const user = await getMe();

  if (!user.success) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-muted-foreground">Manage your account details.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your name.</CardDescription>
        </CardHeader>
        <CardContent>
          <UpdateProfileForm currentName={user.data.name} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>Change your account password.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}