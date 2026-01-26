import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/layout/SEOHead";
import ErrorBoundary from "@/components/ui/error-boundary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Mail, 
  MessageSquare, 
  Building2, 
  Send,
  MapPin,
  Clock,
  Check,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { contactSchema } from "@/lib/validations";
import { useLanguage } from "@/i18n/LanguageContext";

const Contact = () => {
  const { toast } = useToast();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Validate form data
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }
    
    setLoading(true);
    
    // Save to database
    const { error } = await supabase
      .from("contact_messages")
      .insert({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });
    
    if (error) {
      toast({
        title: language === "fr" ? "Erreur" : "Error",
        description: language === "fr" 
          ? "Échec de l'envoi. Veuillez réessayer."
          : "Failed to send message. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
    
    toast({
      title: language === "fr" ? "Message envoyé !" : "Message sent!",
      description: language === "fr" 
        ? "Nous vous répondrons dans les 24 heures."
        : "We'll get back to you within 24 hours.",
    });
    
    setSubmitted(true);
    setLoading(false);
  };

  const contactOptions = [
    {
      icon: Mail,
      title: language === "fr" ? "Email" : "Email",
      description: language === "fr" ? "Pour les demandes générales" : "For general inquiries",
      value: "hello@contextlens.io",
      action: "mailto:hello@contextlens.io",
    },
    {
      icon: Building2,
      title: language === "fr" ? "Ventes" : "Sales",
      description: language === "fr" ? "Entreprise & tarification sur mesure" : "Enterprise & custom pricing",
      value: "sales@contextlens.io",
      action: "mailto:sales@contextlens.io",
    },
    {
      icon: MessageSquare,
      title: "Support",
      description: language === "fr" ? "Assistance technique" : "Technical assistance",
      value: "support@contextlens.io",
      action: "mailto:support@contextlens.io",
    },
  ];

  return (
    <ErrorBoundary>
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead 
        title={language === "fr" ? "Contact - ContextLens" : "Contact - ContextLens"}
        description={language === "fr" ? "Contactez l'équipe ContextLens" : "Contact the ContextLens team"}
      />
      <Header />
      <main className="pt-24 pb-16">
        <div className="container px-4">
          {/* Hero */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {language === "fr" ? "Contactez" : "Get in"}{" "}
              <span className="text-gradient">{language === "fr" ? "Nous" : "Touch"}</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              {language === "fr" 
                ? "Une question, un retour, ou vous voulez en savoir plus sur ContextLens ? Nous serions ravis de vous entendre."
                : "Have a question, feedback, or want to learn more about ContextLens? We'd love to hear from you."}
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Contact Options */}
              <div className="space-y-4">
                {contactOptions.map((option) => (
                  <a
                    key={option.title}
                    href={option.action}
                    className="block p-4 rounded-xl glass-card border-border/50 hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <option.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{option.title}</h3>
                        <p className="text-sm text-muted-foreground">{option.description}</p>
                        <p className="text-sm text-primary mt-1">{option.value}</p>
                      </div>
                    </div>
                  </a>
                ))}

                <div className="p-4 rounded-xl glass-card border-border/50 mt-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-accent/10">
                      <MapPin className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-medium">{language === "fr" ? "Localisation" : "Location"}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Berlin, {language === "fr" ? "Allemagne" : "Germany"}<br />
                        {language === "fr" ? "Basé en UE, conforme RGPD" : "EU-based, GDPR compliant"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl glass-card border-border/50">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-accent/10">
                      <Clock className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-medium">{language === "fr" ? "Temps de réponse" : "Response Time"}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {language === "fr" ? "Généralement sous 24 heures" : "Usually within 24 hours"}<br />
                        {language === "fr" ? "Lun-Ven, 9h-18h CET" : "Mon-Fri, 9AM-6PM CET"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <Card className="glass-card border-border/50">
                  <CardHeader>
                    <CardTitle>{language === "fr" ? "Envoyez-nous un message" : "Send us a message"}</CardTitle>
                    <CardDescription>
                      {language === "fr" 
                        ? "Remplissez le formulaire ci-dessous et nous vous répondrons rapidement."
                        : "Fill out the form below and we'll get back to you soon."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {submitted ? (
                      <div className="py-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-accent/10 mx-auto mb-4 flex items-center justify-center">
                          <Check className="h-8 w-8 text-accent" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                          {language === "fr" ? "Merci !" : "Thank you!"}
                        </h3>
                        <p className="text-muted-foreground">
                          {language === "fr" 
                            ? "Votre message a été reçu. Nous vous contacterons bientôt."
                            : "Your message has been received. We'll be in touch soon."}
                        </p>
                        <Button 
                          variant="ghost" 
                          className="mt-4"
                          onClick={() => {
                            setSubmitted(false);
                            setFormData({ name: "", email: "", subject: "", message: "" });
                          }}
                        >
                          {language === "fr" ? "Envoyer un autre message" : "Send another message"}
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">{language === "fr" ? "Nom" : "Name"}</Label>
                            <Input
                              id="name"
                              placeholder={language === "fr" ? "Votre nom" : "Your name"}
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              className={errors.name ? "border-destructive" : ""}
                              required
                            />
                            {errors.name && (
                              <p className="text-xs text-destructive flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {errors.name}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="you@example.com"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className={errors.email ? "border-destructive" : ""}
                              required
                            />
                            {errors.email && (
                              <p className="text-xs text-destructive flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {errors.email}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="subject">{language === "fr" ? "Sujet" : "Subject"}</Label>
                          <Input
                            id="subject"
                            placeholder={language === "fr" ? "De quoi s'agit-il ?" : "What's this about?"}
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            className={errors.subject ? "border-destructive" : ""}
                            required
                          />
                          {errors.subject && (
                            <p className="text-xs text-destructive flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.subject}
                            </p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="message">Message</Label>
                          <Textarea
                            id="message"
                            placeholder={language === "fr" ? "Dites-nous en plus..." : "Tell us more..."}
                            rows={5}
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className={errors.message ? "border-destructive" : ""}
                            required
                          />
                          {errors.message && (
                            <p className="text-xs text-destructive flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.message}
                            </p>
                          )}
                        </div>

                        <Button type="submit" variant="hero" className="w-full" disabled={loading}>
                          <Send className="h-4 w-4 mr-2" />
                          {loading 
                            ? (language === "fr" ? "Envoi..." : "Sending...") 
                            : (language === "fr" ? "Envoyer le message" : "Send Message")}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
    </ErrorBoundary>
  );
};

export default Contact;
