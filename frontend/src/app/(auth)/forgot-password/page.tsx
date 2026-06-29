import AuthBrandPanel from "@/components/auth/AuthBrandPanel";
import AuthLayout from "@/components/auth/AuthLayout";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      left={
        <AuthBrandPanel
          badge="PASSWORD RECOVERY"
          title={`Reset Your\nPassword`}
          description="Enter the email address associated with your account and we'll send you instructions to reset your password securely."
        />
      }
      right={<ForgotPasswordForm />}
    />
  );
}