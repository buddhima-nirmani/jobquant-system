interface PasswordStrengthProps {
    password: string;
  }
  
  export default function PasswordStrength({
    password,
  }: PasswordStrengthProps) {
    const checks = [
      {
        label: "8+ Characters",
        valid: password.length >= 8,
      },
      {
        label: "Uppercase",
        valid: /[A-Z]/.test(password),
      },
      {
        label: "Lowercase",
        valid: /[a-z]/.test(password),
      },
      {
        label: "Number",
        valid: /\d/.test(password),
      },
      {
        label: "Special",
        valid: /[^A-Za-z0-9]/.test(password),
      },
    ];
  
    const passed = checks.filter((check) => check.valid).length;
  
    const strength =
      passed <= 2
        ? {
            label: "Weak",
            color: "bg-red-500",
          }
        : passed <= 4
        ? {
            label: "Medium",
            color: "bg-amber-500",
          }
        : {
            label: "Strong",
            color: "bg-green-500",
          };
  
    return (
      <div className="rounded-lg border border-[#EAEAEA] bg-[#FAFBFC] p-2">
  
        {/* Header */}
  
        <div className="mb-1.5 flex items-center justify-between">
  
          <span className="text-xs font-semibold text-[#0F172A]">
            Password Strength
          </span>
  
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold text-white ${strength.color}`}
          >
            {strength.label}
          </span>
  
        </div>
  
        {/* Progress */}
  
        <div className="mb-2 h-1 overflow-hidden rounded-full bg-[#E2E8F0]">
  
          <div
            className={`h-full transition-all duration-300 ${strength.color}`}
            style={{
              width: `${(passed / 5) * 100}%`,
            }}
          />
  
        </div>
  
        {/* Requirements */}
  
        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
  
          {checks.map((check) => (
  
            <div
              key={check.label}
              className="flex items-center gap-1.5"
            >
  
              <div
                className={`h-1.5 w-1.5 rounded-full ${
                  check.valid
                    ? "bg-green-500"
                    : "bg-[#CBD5E1]"
                }`}
              />
  
              <span
                className={`text-[10px] ${
                  check.valid
                    ? "font-medium text-[#0F172A]"
                    : "text-[#94A3B8]"
                }`}
              >
                {check.label}
              </span>
  
            </div>
  
          ))}
  
        </div>
  
      </div>
    );
  }