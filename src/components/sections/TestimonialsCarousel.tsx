import { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { useLanguage } from '@/i18n/LanguageContext';
import { Star, Quote } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar?: string;
  rating: number;
}

const TestimonialsCarousel = () => {
  const { language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const testimonials: Testimonial[] = language === 'fr' ? [
    {
      id: '1',
      name: 'Marie Dubois',
      role: 'Directrice Commerciale',
      company: 'TechVente SA',
      content: 'ContextLens a révolutionné nos présentations clients. Les prompts contextuels nous permettent de ne jamais manquer un point clé.',
      rating: 5,
    },
    {
      id: '2',
      name: 'Thomas Martin',
      role: 'Chirurgien Orthopédiste',
      company: 'CHU Paris',
      content: 'L\'intégration avec mes lunettes Even G2 est impeccable. J\'ai accès aux protocoles opératoires en temps réel.',
      rating: 5,
    },
    {
      id: '3',
      name: 'Sophie Chen',
      role: 'Formatrice Technique',
      company: 'Formation Plus',
      content: 'Mes formations sont devenues plus fluides. Je n\'oublie plus jamais un point important grâce aux scripts.',
      rating: 5,
    },
    {
      id: '4',
      name: 'Pierre Leroy',
      role: 'Avocat Associé',
      company: 'Cabinet LR',
      content: 'Indispensable pour mes plaidoiries. Les notes défilent naturellement sans que je perde le contact visuel.',
      rating: 4,
    },
    {
      id: '5',
      name: 'Emma Petit',
      role: 'Conférencière',
      company: 'TEDx Speaker',
      content: 'ContextLens m\'a permis de donner des conférences sans notes visibles. Le public ne sait jamais que j\'ai un prompteur.',
      rating: 5,
    },
  ] : [
    {
      id: '1',
      name: 'Sarah Johnson',
      role: 'Sales Director',
      company: 'TechSales Inc',
      content: 'ContextLens revolutionized our client presentations. Contextual prompts mean we never miss a key point.',
      rating: 5,
    },
    {
      id: '2',
      name: 'Dr. James Wilson',
      role: 'Orthopedic Surgeon',
      company: 'Boston Medical',
      content: 'The Even G2 integration is flawless. I have real-time access to surgical protocols during procedures.',
      rating: 5,
    },
    {
      id: '3',
      name: 'Lisa Zhang',
      role: 'Technical Trainer',
      company: 'TrainPro',
      content: 'My training sessions are so much smoother now. I never forget important points thanks to the scripts.',
      rating: 5,
    },
    {
      id: '4',
      name: 'Michael Brown',
      role: 'Trial Attorney',
      company: 'Brown & Associates',
      content: 'Essential for my court arguments. Notes scroll naturally without breaking eye contact with the jury.',
      rating: 4,
    },
    {
      id: '5',
      name: 'Emma Davis',
      role: 'Keynote Speaker',
      company: 'TEDx',
      content: 'ContextLens lets me deliver talks without visible notes. The audience never knows I have a prompter.',
      rating: 5,
    },
  ];

  // Duplicate testimonials for infinite scroll effect
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  useEffect(() => {
    if (isInView) {
      controls.start({
        x: [0, -50 * testimonials.length + '%'],
        transition: {
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: 30,
            ease: 'linear',
          },
        },
      });
    }
  }, [isInView, controls, testimonials.length]);

  // Pause on hover
  const handleMouseEnter = () => {
    controls.stop();
  };

  const handleMouseLeave = () => {
    controls.start({
      x: [0, -50 * testimonials.length + '%'],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: 'loop',
          duration: 30,
          ease: 'linear',
        },
      },
    });
  };

  return (
    <section ref={containerRef} className="py-24 md:py-32 overflow-hidden">
      <div className="container px-4 mb-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-sm text-primary mb-6">
            <Star className="h-4 w-4 fill-current" />
            {language === 'fr' ? 'Témoignages' : 'Testimonials'}
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            {language === 'fr' ? 'Ce que disent nos' : 'What our'}{' '}
            <span className="text-gradient">{language === 'fr' ? 'utilisateurs' : 'users say'}</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            {language === 'fr'
              ? 'Des milliers de professionnels font confiance à ContextLens pour leurs présentations quotidiennes.'
              : 'Thousands of professionals trust ContextLens for their daily presentations.'}
          </p>
        </div>
      </div>

      {/* Carousel */}
      <div 
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Gradient overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <motion.div
          animate={controls}
          className="flex gap-6 px-4"
          style={{ width: 'fit-content' }}
        >
          {duplicatedTestimonials.map((testimonial, index) => (
            <div
              key={`${testimonial.id}-${index}`}
              className="w-[350px] shrink-0"
            >
              <div className="glass-card rounded-2xl p-6 h-full border border-border/50 hover:border-primary/30 transition-colors">
                <Quote className="h-8 w-8 text-primary/20 mb-4" />
                
                <p className="text-foreground/90 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role} • {testimonial.company}
                    </p>
                  </div>
                </div>

                <div className="flex gap-1 mt-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonial.rating 
                          ? 'text-amber-400 fill-amber-400' 
                          : 'text-muted-foreground/30'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
