import AuthCard from "../_components/AuthCard";
import RegisterForm from "../_components/RegisterForm";

export const metadata = { title: "Create an account" };

export default function RegisterPage() {
  return (
    <AuthCard
      title="Create your account"
      description="Join RentNest as a tenant or landlord."
      footer={{ text: "Already have an account?", linkLabel: "Log in", href: "/login" }}
    >
      <RegisterForm />
    </AuthCard>
  );
}
