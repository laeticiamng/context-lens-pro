import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
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
  Check
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Message sent!",
      description: "We'll get back to you within 24 hours.",
    });
    
    setSubmitted(true);
    setLoading(false);
  };

  const contactOptions = [
    {
      icon: Mail,
      title: "Email",
      description: "For general inquiries",
      value: "hello@contextlens.io",
      action: "mailto:hello@contextlens.io",
    },
    {
      icon: Building2,
      title: "Sales",
      description: "Enterprise & custom pricing",
      value: "sales@contextlens.io",
      action: "mailto:sales@contextlens.io",
    },
    {
      icon: MessageSquare,
      title: "Support",
      description: "Technical assistance",
      value: "support@contextlens.io",
      action: "mailto:support@contextlens.io",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container px-4">
          {/* Hero */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Get in <span className="text-gradient">Touch</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Have a question, feedback, or want to learn more about ContextLens? 
              We'd love to hear from you.
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
                      <h3 className="font-medium">Location</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Berlin, Germany<br />
                        EU-based, GDPR compliant
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl glass-card border-border/50">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10">
                      <Clock className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">Response Time</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Usually within 24 hours<br />
                        Mon-Fri, 9AM-6PM CET
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <Card className="glass-card border-border/50">
                  <CardHeader>
                    <CardTitle>Send us a message</CardTitle>
                    <CardDescription>
                      Fill out the form below and we'll get back to you soon.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {submitted ? (
                      <div className="py-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-accent/10 mx-auto mb-4 flex items-center justify-center">
                          <Check className="h-8 w-8 text-accent" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Thank you!</h3>
                        <p className="text-muted-foreground">
                          Your message has been received. We'll be in touch soon.
                        </p>
                        <Button 
                          variant="ghost" 
                          className="mt-4"
                          onClick={() => {
                            setSubmitted(false);
                            setFormData({ name: "", email: "", subject: "", message: "" });
                          }}
                        >
                          Send another message
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                              id="name"
                              placeholder="Your name"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="you@example.com"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="subject">Subject</Label>
                          <Input
                            id="subject"
                            placeholder="What's this about?"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="message">Message</Label>
                          <Textarea
                            id="message"
                            placeholder="Tell us more..."
                            rows={5}
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            required
                          />
                        </div>

                        <Button type="submit" variant="hero" className="w-full" disabled={loading}>
                          <Send className="h-4 w-4 mr-2" />
                          {loading ? "Sending..." : "Send Message"}
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
  );
};

export default Contact;
