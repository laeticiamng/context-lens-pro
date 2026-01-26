import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, SkipForward, SkipBack, Maximize2, Volume2 } from "lucide-react";

const tourSteps = [
  {
    id: 1,
    title: "Capture Context",
    description: "Your phone camera or smart glasses capture the environment in real-time.",
    timestamp: "0:00",
  },
  {
    id: 2,
    title: "AI Analysis",
    description: "Our vision AI identifies text, objects, people, and scene context instantly.",
    timestamp: "0:15",
  },
  {
    id: 3,
    title: "Smart Matching",
    description: "ContextLens matches the scene to your relevant scripts and talking points.",
    timestamp: "0:30",
  },
  {
    id: 4,
    title: "HUD Display",
    description: "Prompts appear on your smart glasses HUD, perfectly timed and formatted.",
    timestamp: "0:45",
  },
  {
    id: 5,
    title: "Silent Navigation",
    description: "Navigate with touch gestures - no voice commands needed in any situation.",
    timestamp: "1:00",
  },
];

const DemoSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="demo" className="py-24 md:py-32 relative overflow-hidden">
      <div 
        className="absolute inset-0"
        style={{ background: "var(--gradient-hero)" }}
      />
      
      <div className="container relative z-10 px-4">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            See <span className="text-gradient">ContextLens</span> in Action
          </h2>
          <p className="text-lg text-muted-foreground">
            Watch how ContextLens transforms your smart glasses into an intelligent 
            prompter system with real-time contextual awareness.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Video Player */}
            <div className="lg:col-span-3">
              <Card className="glass-card border-border/50 overflow-hidden">
                <div className="relative aspect-video bg-secondary/50">
                  {/* Video Placeholder with animated mockup */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-full max-w-md">
                      {/* Glasses Frame */}
                      <div className="relative mx-auto w-64 h-24 border-2 border-primary/30 rounded-full bg-secondary/30 backdrop-blur-sm">
                        {/* Left Lens */}
                        <div className="absolute left-4 top-4 w-24 h-16 rounded-lg border border-primary/20 bg-background/50 overflow-hidden">
                          <div className="p-2 space-y-1 animate-pulse">
                            <div className="h-1.5 bg-primary/30 rounded w-full" />
                            <div className="h-1.5 bg-primary/20 rounded w-4/5" />
                            <div className="h-1.5 bg-primary/20 rounded w-3/5" />
                          </div>
                        </div>
                        {/* Right Lens */}
                        <div className="absolute right-4 top-4 w-24 h-16 rounded-lg border border-primary/20 bg-background/50 overflow-hidden">
                          <div className="p-2 space-y-1 animate-pulse" style={{ animationDelay: "150ms" }}>
                            <div className="h-1.5 bg-accent/30 rounded w-full" />
                            <div className="h-1.5 bg-accent/20 rounded w-4/5" />
                            <div className="h-1.5 bg-accent/20 rounded w-2/3" />
                          </div>
                        </div>
                        {/* Bridge */}
                        <div className="absolute left-1/2 -translate-x-1/2 top-6 w-8 h-8 border-t-2 border-primary/20" />
                      </div>
                      
                      {/* Demo text */}
                      <p className="text-center mt-8 text-sm text-muted-foreground">
                        Interactive demo coming soon
                      </p>
                    </div>
                  </div>

                  {/* Play Button Overlay */}
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="absolute inset-0 flex items-center justify-center bg-background/20 hover:bg-background/10 transition-colors group"
                  >
                    <div className="h-20 w-20 rounded-full bg-primary/90 flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                      {isPlaying ? (
                        <Pause className="h-8 w-8 text-primary-foreground" />
                      ) : (
                        <Play className="h-8 w-8 text-primary-foreground ml-1" />
                      )}
                    </div>
                  </button>
                </div>

                {/* Video Controls */}
                <CardContent className="p-4 border-t border-border/50">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <SkipBack className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => setIsPlaying(!isPlaying)}
                      >
                        {isPlaying ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <SkipForward className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="flex-1">
                      <div className="h-1 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all duration-300"
                          style={{ width: `${(activeStep / (tourSteps.length - 1)) * 100}%` }}
                        />
                      </div>
                    </div>
                    
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {tourSteps[activeStep].timestamp} / 1:15
                    </span>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Volume2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Maximize2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tour Steps */}
            <div className="lg:col-span-2 space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wide">
                Product Tour
              </h3>
              {tourSteps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(index)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    activeStep === index
                      ? "border-primary/50 bg-primary/5"
                      : "border-border/50 bg-secondary/30 hover:border-border hover:bg-secondary/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                      activeStep === index
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                    }`}>
                      {step.id}
                    </span>
                    <div>
                      <h4 className={`font-medium ${
                        activeStep === index ? "text-foreground" : "text-muted-foreground"
                      }`}>
                        {step.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
