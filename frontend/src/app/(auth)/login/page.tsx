import AuthBrandPanel from "@/components/auth/AuthBrandPanel";
import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout
      left={
        <AuthBrandPanel
          badge="WELCOME BACK"
          title={`Access Your\nClient Portal`}
          description="Securely sign in to review design versions, track printing orders and manage payments until delivery."
        />
      }
      right={<LoginForm />}
    />
  );
}