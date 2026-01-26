import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface RememberMeProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const RememberMe = ({ checked, onCheckedChange }: RememberMeProps) => {
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
        Remember me for 30 days
      </Label>
    </div>
  );
};

export default RememberMe;
