import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";

const partners = [
  { name: "Even Realities", logo: "EVEN" },
  { name: "Vuzix", logo: "VUZIX" },
  { name: "Rokid", logo: "ROKID" },
  { name: "Xreal", logo: "XREAL" },
  { name: "RayNeo", logo: "RAYNEO" },
  { name: "Meta", logo: "META" },
];

const PartnerLogos = () => {
  const { t } = useLanguage();

  return (
    <section className="py-12 border-y border-border/50 bg-secondary/30">
      <div className="container px-4">
        <p className="text-center text-sm text-muted-foreground mb-8">
          {t.partners.compatible}
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="px-6 py-3 rounded-lg bg-background/50 border border-border/50 hover:border-primary/30 transition-all">
                <span className="text-lg font-bold tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
                  {partner.logo}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnerLogos;
