import { useMemo } from "react";
import { Check, X } from "lucide-react";

interface PasswordStrengthMeterProps {
  password: string;
}

interface Requirement {
  label: string;
  met: boolean;
}

const PasswordStrengthMeter = ({ password }: PasswordStrengthMeterProps) => {
  const requirements: Requirement[] = useMemo(() => [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Contains lowercase letter", met: /[a-z]/.test(password) },
    { label: "Contains a number", met: /\d/.test(password) },
  ], [password]);

  const strength = useMemo(() => {
    const metCount = requirements.filter(r => r.met).length;
    if (metCount === 0) return { level: 0, label: "", color: "" };
    if (metCount === 1) return { level: 1, label: "Weak", color: "bg-destructive" };
    if (metCount === 2) return { level: 2, label: "Fair", color: "bg-amber-500" };
    if (metCount === 3) return { level: 3, label: "Good", color: "bg-primary" };
    return { level: 4, label: "Strong", color: "bg-accent" };
  }, [requirements]);

  if (!password) return null;

  return (
    <div className="space-y-3">
      {/* Strength bar */}
      <div className="space-y-1">
        <div className="flex gap-1">
          {[1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                level <= strength.level ? strength.color : "bg-secondary"
              }`}
            />
          ))}
        </div>
        {strength.label && (
          <p className={`text-xs ${
            strength.level <= 1 ? "text-destructive" :
            strength.level === 2 ? "text-amber-500" :
            strength.level === 3 ? "text-primary" : "text-accent"
          }`}>
            {strength.label}
          </p>
        )}
      </div>

      {/* Requirements checklist */}
      <ul className="space-y-1">
        {requirements.map((req) => (
          <li 
            key={req.label}
            className={`flex items-center gap-2 text-xs transition-colors ${
              req.met ? "text-accent" : "text-muted-foreground"
            }`}
          >
            {req.met ? (
              <Check className="h-3 w-3" />
            ) : (
              <X className="h-3 w-3" />
            )}
            {req.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordStrengthMeter;
