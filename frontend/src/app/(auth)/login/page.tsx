import AuthBrandPanel from "@/components/auth/AuthBrandPanel";
import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout
      left={
        <AuthBrandPanel
          badge="WELCOME BACK"
          title={`Access Your\nJobQuant Portal`}
          description="Securely sign in to access your JobQuant portal and manage your printing operations."
        />
      }
      right={<LoginForm />}
    />
  );
}