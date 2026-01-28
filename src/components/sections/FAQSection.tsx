import { useState, forwardRef, useMemo } from "react";
import { ChevronDown, HelpCircle, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { Input } from "@/components/ui/input";

const FAQSection = forwardRef<HTMLElement>((props, ref) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const { t, language } = useLanguage();

  const faqs = language === "fr" ? [
    {
      question: "Quelles lunettes connectées ContextLens prend-il en charge ?",
      answer: "ContextLens prend en charge une large gamme de lunettes connectées dont Even G2, Vuzix Z100, Xreal Air, Rokid et plus encore. Pour les appareils sans accès SDK (comme Ray-Ban Meta), nous proposons un mode de secours téléphone via notifications et TTS audio."
    },
    {
      question: "Comment fonctionne la détection contextuelle ?",
      answer: "Notre système de vision IA capture des images depuis la caméra de votre téléphone ou lunettes, analyse la scène avec des modèles avancés (GPT-4 Vision, OCR, reconnaissance d'entités) et associe le contexte détecté à vos scripts. Le pipeline complet s'exécute en 200-500ms."
    },
    {
      question: "Mes données sont-elles privées et sécurisées ?",
      answer: "Absolument. ContextLens est conçu privacy-first et conforme au RGPD. L'analyse visuelle est opt-in uniquement, aucune vidéo n'est stockée par défaut, toutes les données sont chiffrées E2E, et nous affichons des indicateurs visibles pendant la capture."
    },
    {
      question: "Puis-je utiliser ContextLens hors ligne ?",
      answer: "Les appareils Tier 2+ supportent un mode hors ligne partiel avec traitement sur l'appareil. Les scripts et contextes en cache fonctionnent sans internet. Pour l'analyse IA complète, une connexion internet est nécessaire."
    },
    {
      question: "Quelle est la différence entre les tiers ?",
      answer: "Tier 0 est le mode téléphone uniquement (fonctionne partout). Tier 1 utilise les SDK officiels pour afficher sur le HUD. Tier 2 fonctionne sur l'appareil avec accès aux capteurs natifs. Tier 3 est la RA complète avec ancrage spatial."
    },
    {
      question: "Comment créer et gérer mes scripts ?",
      answer: "Les scripts sont créés dans votre Tableau de bord. Vous pouvez écrire du contenu, ajouter des tags pour le matching intelligent et organiser par catégories. L'aperçu en direct montre exactement comment le contenu apparaîtra sur votre HUD."
    },
    {
      question: "Y a-t-il un essai gratuit ?",
      answer: "Oui ! Le plan Gratuit inclut 10 scripts, 100 analyses par mois et le support Tier 0 pour toujours. Aucune carte bancaire requise. Passez à Pro pour des scripts illimités et des fonctionnalités avancées."
    },
    {
      question: "Comment intégrer ContextLens avec mon app ?",
      answer: "Nous fournissons des SDK pour Flutter (Even G2), Android/iOS natif (Vuzix) et JavaScript. L'intégration de base prend environ 10 lignes de code. Consultez notre Documentation pour les guides spécifiques à chaque appareil."
    },
  ] : [
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

  // Filter FAQs based on search query
  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return faqs;
    const query = searchQuery.toLowerCase();
    return faqs.filter(
      faq => 
        faq.question.toLowerCase().includes(query) || 
        faq.answer.toLowerCase().includes(query)
    );
  }, [faqs, searchQuery]);

  // Highlight matching text
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) => 
      regex.test(part) ? <mark key={i} className="bg-primary/30 text-foreground px-0.5 rounded">{part}</mark> : part
    );
  };

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
            {t.faq.title} <span className="text-gradient">{t.faq.titleHighlight}</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            {language === "fr" 
              ? "Tout ce que vous devez savoir sur ContextLens. Vous n'avez pas trouvé votre réponse ?" 
              : "Everything you need to know about ContextLens. Can't find an answer?"}{" "}
            <a href="/contact" className="text-primary hover:underline">
              {language === "fr" ? "Contactez-nous" : "Contact us"}
            </a>.
          </p>

          {/* Search bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={language === "fr" ? "Rechercher une question..." : "Search questions..."}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setOpenIndex(null);
              }}
              className="pl-10"
              aria-label={language === "fr" ? "Rechercher dans la FAQ" : "Search FAQ"}
            />
          </div>
        </div>

        {/* FAQ List */}
        <div className="max-w-3xl mx-auto space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{language === "fr" ? "Aucun résultat trouvé" : "No results found"}</p>
              <p className="text-sm mt-2">
                <a href="/contact" className="text-primary hover:underline">
                  {language === "fr" ? "Posez-nous votre question" : "Ask us your question"}
                </a>
              </p>
            </div>
          ) : (
            filteredFaqs.map((faq, index) => (
              <div
                key={index}
                className="glass-card rounded-xl border border-border/50 overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/30 transition-colors"
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="font-medium pr-4">
                    {highlightText(faq.question, searchQuery)}
                  </span>
                  <ChevronDown 
                    className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform duration-200 ${
                      openIndex === index ? "rotate-180" : ""
                    }`} 
                  />
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      id={`faq-answer-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 text-muted-foreground leading-relaxed">
                        {highlightText(faq.answer, searchQuery)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
});

FAQSection.displayName = "FAQSection";

export default FAQSection;
