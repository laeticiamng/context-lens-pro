import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/layout/SEOHead";
import ErrorBoundary from "@/components/ui/error-boundary";
import { useLanguage } from "@/i18n/LanguageContext";

const Terms = () => {
  const { language } = useLanguage();

  return (
    <ErrorBoundary>
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead 
        title={language === "fr" ? "Conditions d'Utilisation - ContextLens" : "Terms of Service - ContextLens"}
        description={language === "fr" ? "Nos conditions générales d'utilisation" : "Our terms of service and usage policy"}
      />
      <Header />
      <main className="pt-24 pb-16">
        <div className="container px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">
            {language === "fr" ? "Conditions d'Utilisation" : "Terms of Service"}
          </h1>
          <p className="text-muted-foreground mb-8">
            {language === "fr" ? "Dernière mise à jour : 26 janvier 2026" : "Last updated: January 26, 2026"}
          </p>
          
          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                1. {language === "fr" ? "Acceptation des Conditions" : "Acceptance of Terms"}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {language === "fr" 
                  ? "En accédant et en utilisant ContextLens (\"Service\"), vous acceptez et vous engagez à respecter les termes et conditions de cet accord. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser ce Service."
                  : "By accessing and using ContextLens (\"Service\"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, please do not use this Service."}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                2. {language === "fr" ? "Description du Service" : "Description of Service"}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {language === "fr" 
                  ? "ContextLens fournit une plateforme logicielle permettant aux lunettes connectées de fonctionner comme des prompteurs contextuels grâce à l'analyse de vision par IA. Le Service comprend des applications web, des applications mobiles, des API et la documentation associée."
                  : "ContextLens provides a software platform that enables smart glasses to function as contextual prompters using AI-powered vision analysis. The Service includes web applications, mobile applications, APIs, and related documentation."}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                3. {language === "fr" ? "Comptes Utilisateurs" : "User Accounts"}
              </h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>{language === "fr" ? "Vous devez avoir au moins 18 ans pour utiliser ce Service" : "You must be at least 18 years old to use this Service"}</li>
                <li>{language === "fr" ? "Vous êtes responsable de la sécurité de votre compte" : "You are responsible for maintaining the security of your account"}</li>
                <li>{language === "fr" ? "Vous êtes responsable de toutes les activités sous votre compte" : "You are responsible for all activities that occur under your account"}</li>
                <li>{language === "fr" ? "Vous devez nous informer immédiatement de toute utilisation non autorisée" : "You must notify us immediately of any unauthorized use"}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                4. {language === "fr" ? "Utilisation Acceptable" : "Acceptable Use"}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {language === "fr" 
                  ? "Vous acceptez de ne pas utiliser le Service pour :"
                  : "You agree not to use the Service to:"}
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>{language === "fr" ? "Violer les lois ou réglementations applicables" : "Violate any applicable laws or regulations"}</li>
                <li>{language === "fr" ? "Porter atteinte aux droits d'autrui" : "Infringe upon the rights of others"}</li>
                <li>{language === "fr" ? "Enregistrer ou surveiller autrui sans consentement" : "Record or surveil others without their consent"}</li>
                <li>{language === "fr" ? "Transmettre du code nuisible ou malveillant" : "Transmit harmful or malicious code"}</li>
                <li>{language === "fr" ? "Tenter d'accéder sans autorisation à nos systèmes" : "Attempt to gain unauthorized access to our systems"}</li>
                <li>{language === "fr" ? "Utiliser le Service à des fins illégales" : "Use the Service for any illegal or unauthorized purpose"}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                5. {language === "fr" ? "Propriété Intellectuelle" : "Intellectual Property"}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {language === "fr" 
                  ? "Le Service et son contenu original, ses fonctionnalités et sa fonctionnalité sont et resteront la propriété exclusive de ContextLens et de ses concédants de licence. Le Service est protégé par le droit d'auteur, les marques et d'autres lois."
                  : "The Service and its original content, features, and functionality are and will remain the exclusive property of ContextLens and its licensors. The Service is protected by copyright, trademark, and other laws. Our trademarks may not be used in connection with any product or service without prior written consent."}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                6. {language === "fr" ? "Abonnement et Paiements" : "Subscription and Payments"}
              </h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>{language === "fr" ? "Certaines fonctionnalités nécessitent un abonnement payant" : "Some features require a paid subscription"}</li>
                <li>{language === "fr" ? "Les frais d'abonnement sont facturés à l'avance mensuellement ou annuellement" : "Subscription fees are billed in advance on a monthly or annual basis"}</li>
                <li>{language === "fr" ? "Tous les frais sont non remboursables sauf si la loi l'exige" : "All fees are non-refundable except as required by law"}</li>
                <li>{language === "fr" ? "Nous nous réservons le droit de modifier les prix avec un préavis de 30 jours" : "We reserve the right to change pricing with 30 days notice"}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                7. {language === "fr" ? "Limitation de Responsabilité" : "Limitation of Liability"}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {language === "fr" 
                  ? "En aucun cas ContextLens, ni ses administrateurs, employés, partenaires, agents, fournisseurs ou affiliés ne seront responsables de tout dommage indirect, accessoire, spécial, consécutif ou punitif."
                  : "In no event shall ContextLens, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses."}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                8. {language === "fr" ? "Résiliation" : "Termination"}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {language === "fr" 
                  ? "Nous pouvons résilier ou suspendre votre compte et interdire l'accès au Service immédiatement, sans préavis ni responsabilité, à notre seule discrétion, pour quelque raison que ce soit."
                  : "We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including without limitation if you breach the Terms."}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                9. {language === "fr" ? "Modifications des Conditions" : "Changes to Terms"}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {language === "fr" 
                  ? "Nous nous réservons le droit de modifier ou de remplacer ces Conditions à tout moment. Si une révision est importante, nous fournirons un préavis d'au moins 30 jours avant l'entrée en vigueur des nouvelles conditions."
                  : "We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect."}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                10. Contact
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {language === "fr" 
                  ? "Si vous avez des questions sur ces Conditions, veuillez nous contacter à :"
                  : "If you have any questions about these Terms, please contact us at:"}
              </p>
              <p className="text-primary mt-2">legal@contextlens.io</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
    </ErrorBoundary>
  );
};

export default Terms;
