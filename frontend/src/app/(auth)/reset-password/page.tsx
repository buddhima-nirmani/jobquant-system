import AuthBrandPanel from "@/components/auth/AuthBrandPanel";
import AuthLayout from "@/components/auth/AuthLayout";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      left={
        <AuthBrandPanel
          badge="PASSWORD RESET"
          title={`Create Your\nNew Password`}
          description="Create a secure password to regain access to your JobQuant Client Portal."
        />
      }
      right={<ResetPasswordForm />}
    />
  );
}