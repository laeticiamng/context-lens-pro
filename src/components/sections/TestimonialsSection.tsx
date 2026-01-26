import { Star, Quote } from "lucide-react";

const testimonials = [
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

const TestimonialsSection = () => {
  return (
    <section className="py-24 md:py-32 overflow-hidden">
      <div className="container px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Loved by <span className="text-gradient">Professionals</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            See how ContextLens is transforming workflows across industries.
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
