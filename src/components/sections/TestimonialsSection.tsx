import { Star, Quote } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const TestimonialsSection = () => {
  const { t, language } = useLanguage();

  const testimonials = language === "fr" ? [
    {
      name: "Dr. Sarah Chen",
      role: "Chirurgienne, Charité Berlin",
      avatar: "SC",
      content: "ContextLens a transformé mes procédures chirurgicales. Avoir les notes patient qui apparaissent sur mes lunettes pendant les opérations sans quitter le champ opératoire est révolutionnaire pour la sécurité.",
      rating: 5,
    },
    {
      name: "Marcus Rivera",
      role: "Directeur Commercial, TechCorp",
      avatar: "MR",
      content: "Je conclus 40% de deals en plus maintenant. Entrer en réunion avec les infos contextuelles client sur mon HUD me donne confiance. L'intégration Even G2 est parfaite.",
      rating: 5,
    },
    {
      name: "Yuki Tanaka",
      role: "Conférencière",
      avatar: "YT",
      content: "Plus besoin de lire mes notes ou d'oublier des points clés. ContextLens me montre exactement quoi dire selon les réactions du public. Parler en public n'a jamais été aussi simple.",
      rating: 5,
    },
    {
      name: "James O'Connor",
      role: "Technicien Terrain, EnergyCo",
      avatar: "JO",
      content: "Les manuels d'équipement directement dans mes lunettes pendant que mes mains sont libres. Le mode Tier 0 fonctionne très bien même avec des lunettes de sécurité basiques. Solution brillante.",
      rating: 4,
    },
    {
      name: "Dr. Maria Gonzalez",
      role: "Chercheuse, CERN",
      avatar: "MG",
      content: "L'approche privacy-first nous a convaincus. Conformité RGPD, chiffrement E2E, et l'option d'auto-hébergement ont fait de ContextLens le seul choix viable pour notre labo.",
      rating: 5,
    },
    {
      name: "Alex Kim",
      role: "Développeur Indépendant",
      avatar: "AK",
      content: "La documentation SDK est excellente. Mon app Flutter était intégrée avec Even G2 en moins d'une heure. L'API est propre et bien conçue. 10/10 pour l'expérience développeur.",
      rating: 5,
    },
  ] : [
    {
      name: "Dr. Sarah Chen",
      role: "Surgeon, Berlin Charité",
      avatar: "SC",
      content: "ContextLens transformed my surgical procedures. Having patient notes appear on my glasses during operations without looking away from the field is a game-changer for safety.",
      rating: 5,
    },
    {
      name: "Marcus Rivera",
      role: "Sales Director, TechCorp",
      avatar: "MR",
      content: "I close 40% more deals now. Walking into meetings with contextual client info appearing on my HUD gives me confidence. The Even G2 integration is seamless.",
      rating: 5,
    },
    {
      name: "Yuki Tanaka",
      role: "Conference Speaker",
      avatar: "YT",
      content: "No more reading from notes or forgetting key points. ContextLens shows me exactly what to say based on audience reactions. Public speaking has never been easier.",
      rating: 5,
    },
    {
      name: "James O'Connor",
      role: "Field Technician, EnergyCo",
      avatar: "JO",
      content: "Equipment manuals right in my glasses while my hands are free. The Tier 0 phone fallback works great even with basic safety glasses. Brilliant solution.",
      rating: 4,
    },
    {
      name: "Dr. Maria Gonzalez",
      role: "Researcher, CERN",
      avatar: "MG",
      content: "The privacy-first approach won us over. GDPR compliance, E2E encryption, and the option to self-host made ContextLens the only viable choice for our lab.",
      rating: 5,
    },
    {
      name: "Alex Kim",
      role: "Indie Developer",
      avatar: "AK",
      content: "The SDK documentation is excellent. Had my Flutter app integrated with Even G2 in under an hour. The API is clean and well-designed. 10/10 DX.",
      rating: 5,
    },
  ];

  return (
    <section className="py-24 md:py-32 overflow-hidden">
      <div className="container px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            {t.testimonials.title} <span className="text-gradient">{t.testimonials.titleHighlight}</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            {language === "fr" 
              ? "Découvrez comment ContextLens transforme les flux de travail dans tous les secteurs."
              : "See how ContextLens is transforming workflows across industries."}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="glass-card rounded-2xl p-6 border border-border/50 hover:border-primary/30 transition-all duration-300"
            >
              {/* Quote Icon */}
              <Quote className="h-8 w-8 text-primary/30 mb-4" />
              
              {/* Content */}
              <p className="text-muted-foreground leading-relaxed mb-6">
                "{testimonial.content}"
              </p>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < testimonial.rating
                        ? "text-amber-400 fill-amber-400"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-medium text-sm">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-medium text-sm">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
