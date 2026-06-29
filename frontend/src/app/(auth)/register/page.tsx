import AuthBrandPanel from "@/components/auth/AuthBrandPanel";
import AuthLayout from "@/components/auth/AuthLayout";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthLayout
      left={
        <AuthBrandPanel
          badge="JOIN JOBQUANT"
          title={`Create Your\nClient Account`}
          description="Create your client account to track printing orders, review design versions and manage payments throughout your printing journey."
        />
      }
      right={<RegisterForm />}
    />
  );
}