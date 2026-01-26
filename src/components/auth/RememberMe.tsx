import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/i18n/LanguageContext";

interface RememberMeProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const RememberMe = ({ checked, onCheckedChange }: RememberMeProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id="remember"
        checked={checked}
        onCheckedChange={(checked) => onCheckedChange(checked === true)}
      />
      <Label
        htmlFor="remember"
        className="text-sm text-muted-foreground cursor-pointer"
      >
        {t.auth.rememberMe}
      </Label>
    </div>
  );
};

export default RememberMe;
