import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";
import { useState, forwardRef } from "react";
import { useWaitlist } from "@/hooks/useWaitlist";

const CTASection = forwardRef<HTMLElement>((_, ref) => {
  const [email, setEmail] = useState("");
  const { joinWaitlist, loading } = useWaitlist();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await joinWaitlist(email);
    if (success) {
      setEmail("");
    }
  };

  return (
    <section ref={ref} className="py-24 md:py-32 relative overflow-hidden">
      {/* Background effects */}
      <div 
        className="absolute inset-0"
        style={{ background: "var(--gradient-hero)" }}
      />
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px]"
        style={{ background: "var(--gradient-glow)" }}
      />

      <div className="container relative z-10 px-4">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-sm text-primary mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span>Early Access Now Open</span>
          </div>

          {/* Headline */}
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to transform your{" "}
            <span className="text-gradient">smart glasses</span>?
          </h2>

          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Join the waitlist for early access. Be among the first to experience 
            contextual prompter technology.
          </p>

          {/* Email Form */}
          <form 
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-8"
          >
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-12 pl-12 pr-4 rounded-xl bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              />
            </div>
            <Button type="submit" variant="hero" size="lg" disabled={loading}>
              {loading ? "Joining..." : "Get Early Access"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          {/* Social proof */}
          <p className="text-sm text-muted-foreground">
            Join <span className="text-foreground font-medium">500+</span> developers and professionals on the waitlist
          </p>
        </div>
      </div>
    </section>
  );
});

CTASection.displayName = "CTASection";

export default CTASection;
