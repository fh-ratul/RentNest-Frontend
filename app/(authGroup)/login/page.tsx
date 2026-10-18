import AuthCard from "../_components/AuthCard";
import LoginForm from "../_components/LoginForm";
import DemoLogin from "../_components/DemoLogin";

export const metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <AuthCard
      title="Welcome back"
      description="Enter your credentials to access your account."
      footer={{ text: "New to RentNest?", linkLabel: "Create an account", href: "/register" }}
    >
      <LoginForm />
      <DemoLogin />
    </AuthCard>
  );
}
