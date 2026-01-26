import { Camera, Eye, Route, Database, FileText, Monitor } from "lucide-react";

const pipelineSteps = [
  {
    id: "capture",
    icon: Camera,
    title: "Capture",
    description: "Camera feed from glasses or phone",
    details: ["Frame JPEG extraction", "1-10 fps configurable", "Auto-switch sources"],
    color: "primary",
  },
  {
    id: "perception",
    icon: Eye,
    title: "Perception",
    description: "AI understands what you're seeing",
    details: ["Multi-language OCR", "Entity recognition", "Scene classification"],
    color: "accent",
  },
  {
    id: "routing",
    icon: Route,
    title: "Routing",
    description: "Match context to content",
    details: ["Tag-based matching", "Relevance scoring", "Top-k candidates"],
    color: "primary",
  },
  {
    id: "retrieval",
    icon: Database,
    title: "Retrieval",
    description: "Semantic search for scripts",
    details: ["Vector embeddings", "RAG pipeline", "Combined ranking"],
    color: "accent",
  },
  {
    id: "composer",
    icon: FileText,
    title: "Composer",
    description: "Format for micro-display",
    details: ["10-15 line blocks", "Display adaptation", "Scroll management"],
    color: "primary",
  },
  {
    id: "renderer",
    icon: Monitor,
    title: "Renderer",
    description: "Push to your device",
    details: ["Device adapters", "Input handling", "Phone fallback"],
    color: "accent",
  },
];

const PipelineSection = () => {
  return (
    <section id="pipeline" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px]"
        style={{ background: "var(--gradient-glow)", opacity: 0.3 }}
      />

      <div className="container relative z-10 px-4">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Universal <span className="text-gradient">Pipeline</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Same flow, every device. From capture to display in milliseconds.
          </p>
        </div>

        {/* Pipeline Flow */}
        <div className="max-w-5xl mx-auto">
          {/* Desktop: Horizontal flow */}
          <div className="hidden lg:block">
            <div className="flex items-start justify-between relative">
              {/* Connection line */}
              <div className="absolute top-12 left-[10%] right-[10%] h-px bg-gradient-to-r from-primary via-accent to-primary opacity-30" />
              
              {pipelineSteps.map((step, index) => (
                <div key={step.id} className="relative flex flex-col items-center w-1/6">
                  {/* Step number */}
                  <div className="absolute -top-6 text-xs font-mono text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  
                  {/* Icon */}
                  <div 
                    className={`relative z-10 p-4 rounded-2xl glass-card-elevated mb-4 ${
                      step.color === "primary" 
                        ? "text-primary" 
                        : "text-accent"
                    }`}
                  >
                    <step.icon className="h-6 w-6" />
                  </div>

                  {/* Content */}
                  <h3 className="font-semibold mb-1 text-center">{step.title}</h3>
                  <p className="text-xs text-muted-foreground text-center mb-3">
                    {step.description}
                  </p>

                  {/* Details */}
                  <ul className="space-y-1">
                    {step.details.map((detail) => (
                      <li key={detail} className="text-xs text-muted-foreground/70 text-center">
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile/Tablet: Vertical flow */}
          <div className="lg:hidden space-y-6">
            {pipelineSteps.map((step, index) => (
              <div key={step.id} className="flex gap-4">
                {/* Left side - number and line */}
                <div className="flex flex-col items-center">
                  <div className="text-xs font-mono text-muted-foreground mb-2">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div 
                    className={`p-3 rounded-xl glass-card ${
                      step.color === "primary" 
                        ? "text-primary" 
                        : "text-accent"
                    }`}
                  >
                    <step.icon className="h-5 w-5" />
                  </div>
                  {index < pipelineSteps.length - 1 && (
                    <div className="flex-1 w-px bg-border/50 mt-2" />
                  )}
                </div>

                {/* Right side - content */}
                <div className="flex-1 pb-6">
                  <h3 className="font-semibold mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {step.description}
                  </p>
                  <ul className="flex flex-wrap gap-2">
                    {step.details.map((detail) => (
                      <li 
                        key={detail} 
                        className="text-xs px-2 py-1 rounded bg-secondary/50 text-muted-foreground"
                      >
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PipelineSection;
