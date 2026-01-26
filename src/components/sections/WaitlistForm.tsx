import { useState, forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Mail, ArrowRight, Check, Loader2 } from "lucide-react";
import { useWaitlist } from "@/hooks/useWaitlist";

interface WaitlistFormProps {
  source?: string;
  className?: string;
}

const WaitlistForm = forwardRef<HTMLFormElement, WaitlistFormProps>(
  ({ source = "cta", className = "" }, ref) => {
  const [email, setEmail] = useState("");
  const { joinWaitlist, isLoading, isSuccess, error } = useWaitlist();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    await joinWaitlist(email, source);
    if (!error) {
      setEmail("");
    }
  };

  if (isSuccess) {
    return (
      <div className={`flex flex-col items-center gap-3 ${className}`}>
        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
          <Check className="h-6 w-6 text-accent" />
        </div>
        <p className="text-center font-medium">You're on the list!</p>
        <p className="text-sm text-muted-foreground text-center">
          We'll notify you when early access opens.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col gap-3 ${className}`}>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            required
          />
        </div>
        <Button type="submit" variant="hero" disabled={isLoading || !email.trim()}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Join Waitlist
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>
      
      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}
      
      <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
        <Badge variant="outline" className="border-primary/30">
          Free Early Access
        </Badge>
        <span>•</span>
        <span>No credit card required</span>
        <span>•</span>
        <span>5,000+ on waitlist</span>
      </div>
    </form>
  );
});

WaitlistForm.displayName = "WaitlistForm";

export default WaitlistForm;
