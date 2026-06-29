import AuthBrandPanel from "@/components/auth/AuthBrandPanel";
import AuthLayout from "@/components/auth/AuthLayout";
import PasswordResetSuccess from "@/components/auth/PasswordResetSuccess";

export default function PasswordResetSuccessPage() {
  return (
    <AuthLayout
      left={
        <AuthBrandPanel
          badge="PASSWORD UPDATED"
          title={`You're Ready\nTo Sign In`}
          description="Your password has been updated successfully. Continue to your JobQuant Client Portal using your new credentials."
        />
      }
      right={<PasswordResetSuccess />}
    />
  );
}