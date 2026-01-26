import { useState, forwardRef } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "Which smart glasses does ContextLens support?",
    answer: "ContextLens supports a wide range of smart glasses including Even G2, Vuzix Z100, Xreal Air, Rokid, and more. For devices without SDK access (like Ray-Ban Meta), we provide a phone fallback mode using notifications and audio TTS. Check our Devices section for the full compatibility matrix."
  },
  {
    question: "How does the contextual detection work?",
    answer: "Our AI vision system captures frames from your phone camera or smart glasses, analyzes the scene using advanced models (GPT-4 Vision, OCR, entity recognition), and matches detected context to your scripts using semantic search. The entire pipeline runs in 200-500ms."
  },
  {
    question: "Is my data private and secure?",
    answer: "Absolutely. ContextLens is built privacy-first and GDPR compliant. Visual analysis is opt-in only, no video is stored by default, all data is E2E encrypted, and we display visible indicators during capture. You can self-host the enterprise version for maximum control."
  },
  {
    question: "Can I use ContextLens offline?",
    answer: "Tier 2+ devices support partial offline mode with on-device processing. Scripts and cached contexts work without internet. For full AI analysis, an internet connection is needed for cloud processing, though we're working on local models for complete offline support."
  },
  {
    question: "What's the difference between the tiers?",
    answer: "Tier 0 is phone-only fallback (works everywhere). Tier 1 uses official SDKs to display on HUD. Tier 2 runs on-device with native sensor access. Tier 3 is full AR with spatial anchoring. Each tier adds capabilities while maintaining backward compatibility."
  },
  {
    question: "How do I create and manage scripts?",
    answer: "Scripts are created in your Dashboard. You can write content, add tags for smart matching, and organize by categories. The live preview shows exactly how content will appear on your HUD. Scripts can be imported from text files or synced from cloud services."
  },
  {
    question: "Is there a free trial?",
    answer: "Yes! The Free plan includes 10 scripts, 100 analyses per month, and Tier 0 support forever. No credit card required. Upgrade to Pro for unlimited scripts and advanced features, or contact us for Enterprise deployment options."
  },
  {
    question: "How do I integrate ContextLens with my app?",
    answer: "We provide SDKs for Flutter (Even G2), native Android/iOS (Vuzix), and JavaScript. The basic integration takes about 10 lines of code. Check our Documentation for device-specific guides and the full API reference."
  },
];

const FAQSection = forwardRef<HTMLElement>((props, ref) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section ref={ref} id="faq" className="py-24 md:py-32">
      <div className="container px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-sm text-primary mb-6">
            <HelpCircle className="h-4 w-4" />
            FAQ
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about ContextLens. Can't find an answer?{" "}
            <a href="/contact" className="text-primary hover:underline">Contact us</a>.
          </p>
        </div>

        {/* FAQ List */}
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="glass-card rounded-xl border border-border/50 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/30 transition-colors"
              >
                <span className="font-medium pr-4">{faq.question}</span>
                <ChevronDown 
                  className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`} 
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

FAQSection.displayName = "FAQSection";

export default FAQSection;
