import { useState } from "react";
import { Camera, Eye, Route, Database, FileText, Monitor, ChevronRight, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";

const techStacks = {
  capture: ["MediaStream API", "WebRTC", "JPEG Encoder"],
  perception: ["GPT-4 Vision", "Tesseract.js", "CLIP"],
  routing: ["Vector Search", "TF-IDF", "BM25"],
  retrieval: ["OpenAI Embeddings", "Pinecone", "PostgreSQL"],
  composer: ["Markdown Parser", "Display Adapters"],
  renderer: ["Even SDK", "Vuzix SDK", "Push API"],
};

const metrics = {
  capture: { latency: "~50ms", throughput: "10 fps max" },
  perception: { latency: "200-500ms", accuracy: "95%+" },
  routing: { latency: "~20ms", candidates: "Top 5" },
  retrieval: { latency: "~100ms", recall: "98%+" },
  composer: { blockSize: "10-15 lines", readTime: "3-5s" },
  renderer: { latency: "~30ms", devices: "10+" },
};

const stepIds = ["capture", "perception", "routing", "retrieval", "composer", "renderer"] as const;
type StepId = typeof stepIds[number];

const stepIcons: Record<StepId, typeof Camera> = {
  capture: Camera,
  perception: Eye,
  routing: Route,
  retrieval: Database,
  composer: FileText,
  renderer: Monitor,
};

const InteractivePipeline = () => {
  const { t } = useLanguage();
  const [activeStep, setActiveStep] = useState<StepId | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleStepClick = (stepId: StepId) => {
    setActiveStep(activeStep === stepId ? null : stepId);
  };

  const runAnimation = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    const animateSteps = async () => {
      for (let i = 0; i < stepIds.length; i++) {
        setActiveStep(stepIds[i]);
        await new Promise(r => setTimeout(r, 800));
      }
      await new Promise(r => setTimeout(r, 500));
      setActiveStep(null);
      setIsAnimating(false);
    };
    
    animateSteps();
  };

  const pipelineSteps = stepIds.map(id => ({
    id,
    icon: stepIcons[id],
    ...t.pipelineSteps[id],
    techStack: techStacks[id],
    metrics: metrics[id],
  }));

  const activeStepData = activeStep ? pipelineSteps.find(s => s.id === activeStep) : null;

  return (
    <section id="pipeline" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[800px]"
        style={{ background: "var(--gradient-glow)", opacity: 0.2 }}
      />

      <div className="container relative z-10 px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            {t.pipeline.title}{" "}
            <span className="text-gradient">{t.pipeline.titleHighlight}</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            {t.pipeline.description}
          </p>
          <button 
            onClick={runAnimation}
            disabled={isAnimating}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 transition-colors disabled:opacity-50"
          >
            <Zap className="h-4 w-4" />
            {isAnimating ? t.pipelineSteps.animating : t.pipelineSteps.runDemo}
          </button>
        </div>

        {/* Pipeline Flow - Desktop */}
        <div className="hidden lg:block max-w-6xl mx-auto mb-8">
          <div className="flex items-center justify-between relative">
            {/* Animated connection line */}
            <div className="absolute top-1/2 left-[8%] right-[8%] h-1 -translate-y-1/2">
              <div className="h-full bg-border/30 rounded-full" />
              <motion.div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full"
                initial={{ width: "0%" }}
                animate={{ 
                  width: isAnimating ? "100%" : "0%",
                  transition: { duration: 4.8, ease: "linear" }
                }}
              />
            </div>
            
            {pipelineSteps.map((step, index) => {
              const isActive = activeStep === step.id;
              const isPast = activeStep && stepIds.findIndex(s => s === activeStep) > index;
              
              return (
                <div key={step.id} className="relative flex flex-col items-center" style={{ width: `${100/6}%` }}>
                  {/* Step number */}
                  <div className="absolute -top-8 text-xs font-mono text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  
                  {/* Icon button */}
                  <motion.button
                    onClick={() => handleStepClick(step.id)}
                    className={`relative z-10 p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                      isActive 
                        ? "bg-primary text-primary-foreground border-primary shadow-lg scale-110" 
                        : isPast
                        ? "bg-primary/20 text-primary border-primary/50"
                        : "glass-card border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30"
                    }`}
                    whileHover={{ scale: isActive ? 1.1 : 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={isActive ? { 
                      boxShadow: ["0 0 0px hsl(var(--primary))", "0 0 30px hsl(var(--primary) / 0.5)", "0 0 0px hsl(var(--primary))"]
                    } : {}}
                    transition={{ duration: 0.5, repeat: isActive ? Infinity : 0 }}
                  >
                    <step.icon className="h-6 w-6" />
                  </motion.button>

                  {/* Arrow */}
                  {index < pipelineSteps.length - 1 && (
                    <ChevronRight 
                      className={`absolute top-1/2 -right-3 -translate-y-1/2 h-5 w-5 transition-colors ${
                        isPast || isActive ? "text-primary" : "text-border"
                      }`}
                    />
                  )}

                  {/* Label */}
                  <h3 className={`mt-4 font-bold text-sm tracking-wide transition-colors ${
                    isActive ? "text-primary" : "text-foreground"
                  }`}>
                    {step.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">{step.subtitle}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile: Vertical flow */}
        <div className="lg:hidden space-y-4 mb-8">
          {pipelineSteps.map((step, index) => {
            const isActive = activeStep === step.id;
            
            return (
              <motion.button
                key={step.id}
                onClick={() => handleStepClick(step.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                  isActive 
                    ? "bg-primary/10 border-primary" 
                    : "glass-card border-border/50"
                }`}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-xs font-mono text-muted-foreground w-6">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div className={`p-3 rounded-xl ${isActive ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"}`}>
                  <step.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm">{step.title}</h3>
                  <p className="text-xs text-muted-foreground">{step.subtitle}</p>
                </div>
                <ChevronRight className={`h-5 w-5 transition-transform ${isActive ? "rotate-90 text-primary" : "text-muted-foreground"}`} />
              </motion.button>
            );
          })}
        </div>

        {/* Detail Panel */}
        <AnimatePresence mode="wait">
          {activeStepData && (
            <motion.div
              key={activeStepData.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto"
            >
              <div className="glass-card-elevated rounded-2xl p-6 md:p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-primary text-primary-foreground">
                    <activeStepData.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{activeStepData.title}</h3>
                    <p className="text-muted-foreground">{activeStepData.description}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {/* Features */}
                  <div>
                    <h4 className="text-sm font-semibold text-foreground/70 uppercase tracking-wide mb-3">
                      {t.pipelineSteps.features}
                    </h4>
                    <ul className="space-y-2">
                      {activeStepData.details.map((detail, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                          <span className="text-muted-foreground">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tech Stack */}
                  <div>
                    <h4 className="text-sm font-semibold text-foreground/70 uppercase tracking-wide mb-3">
                      {t.pipelineSteps.techStack}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {activeStepData.techStack.map((tech) => (
                        <span key={tech} className="px-2.5 py-1 rounded-full bg-secondary text-xs font-medium">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Metrics */}
                  <div>
                    <h4 className="text-sm font-semibold text-foreground/70 uppercase tracking-wide mb-3">
                      {t.pipelineSteps.performance}
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(activeStepData.metrics).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-muted-foreground capitalize">{key}</span>
                          <span className="font-mono text-primary">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Placeholder when no step selected */}
        {!activeStepData && (
          <div className="max-w-4xl mx-auto text-center py-8">
            <p className="text-muted-foreground">
              {t.pipelineSteps.clickHint}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default InteractivePipeline;