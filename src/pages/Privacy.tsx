import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/layout/SEOHead";
import ErrorBoundary from "@/components/ui/error-boundary";
import { useLanguage } from "@/i18n/LanguageContext";

const Privacy = () => {
  const { language } = useLanguage();

  return (
    <ErrorBoundary>
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead 
        title={language === "fr" ? "Politique de Confidentialité - ContextLens" : "Privacy Policy - ContextLens"}
        description={language === "fr" ? "Notre politique de confidentialité et conformité RGPD" : "Our privacy policy and GDPR compliance"}
      />
      <Header />
      <main className="pt-24 pb-16">
        <div className="container px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">
            {language === "fr" ? "Politique de Confidentialité" : "Privacy Policy"}
          </h1>
          <p className="text-muted-foreground mb-8">
            {language === "fr" ? "Dernière mise à jour : 26 janvier 2026" : "Last updated: January 26, 2026"}
          </p>
          
          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                1. {language === "fr" ? "Introduction" : "Introduction"}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {language === "fr" 
                  ? "ContextLens (\"nous\", \"notre\") s'engage à protéger votre vie privée. Cette Politique de Confidentialité explique comment nous collectons, utilisons, divulguons et protégeons vos informations lorsque vous utilisez notre plateforme de prompteur contextuel pour lunettes connectées."
                  : "ContextLens (\"we\", \"our\", or \"us\") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our smart glasses contextual prompter platform."}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                2. {language === "fr" ? "Informations Collectées" : "Information We Collect"}
              </h2>
              <h3 className="text-xl font-medium mb-2 mt-4">
                2.1 {language === "fr" ? "Informations Personnelles" : "Personal Information"}
              </h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>{language === "fr" ? "Adresse email lors de la création de compte" : "Email address when you create an account"}</li>
                <li>{language === "fr" ? "Nom d'affichage (optionnel)" : "Display name (optional)"}</li>
                <li>{language === "fr" ? "Informations sur les appareils connectés" : "Device information for connected smart glasses"}</li>
              </ul>
              
              <h3 className="text-xl font-medium mb-2 mt-4">
                2.2 {language === "fr" ? "Données Visuelles" : "Visual Data"}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                <strong>{language === "fr" ? "Important :" : "Important:"}</strong>{" "}
                {language === "fr" 
                  ? "Nous NE stockons PAS d'images ou de vidéos de votre caméra. Les données visuelles sont traitées en temps réel pour l'analyse de contexte et immédiatement supprimées. Seules les métadonnées extraites (type de scène, catégories de texte détectées) peuvent être temporairement mises en cache pour optimiser les performances."
                  : "We do NOT store images or video from your camera. Visual data is processed in real-time for context analysis and immediately discarded. Only extracted metadata (scene type, detected text categories) may be temporarily cached for performance optimization."}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                3. {language === "fr" ? "Utilisation de Vos Informations" : "How We Use Your Information"}
              </h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>{language === "fr" ? "Fournir et maintenir notre service" : "To provide and maintain our service"}</li>
                <li>{language === "fr" ? "Vous informer des changements" : "To notify you about changes to our service"}</li>
                <li>{language === "fr" ? "Fournir un support client" : "To provide customer support"}</li>
                <li>{language === "fr" ? "Collecter des analyses pour améliorer notre service" : "To gather analysis or valuable information to improve our service"}</li>
                <li>{language === "fr" ? "Détecter et prévenir les problèmes techniques" : "To detect, prevent and address technical issues"}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                4. {language === "fr" ? "Sécurité des Données" : "Data Security"}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {language === "fr" 
                  ? "Nous mettons en œuvre des mesures de sécurité conformes aux normes de l'industrie :"
                  : "We implement industry-standard security measures including:"}
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-2">
                <li>{language === "fr" ? "Chiffrement de bout en bout pour toutes les transmissions" : "End-to-end encryption for all data transmission"}</li>
                <li>{language === "fr" ? "Infrastructure cloud sécurisée avec conformité SOC 2" : "Secure cloud infrastructure with SOC 2 compliance"}</li>
                <li>{language === "fr" ? "Audits de sécurité réguliers et tests de pénétration" : "Regular security audits and penetration testing"}</li>
                <li>{language === "fr" ? "Contrôles d'accès et exigences d'authentification" : "Access controls and authentication requirements"}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                5. {language === "fr" ? "Conformité RGPD" : "GDPR Compliance"}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {language === "fr" 
                  ? "Si vous êtes résident européen, vous avez le droit de :"
                  : "If you are a European resident, you have the right to:"}
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-2">
                <li>{language === "fr" ? "Accéder à vos données personnelles" : "Access your personal data"}</li>
                <li>{language === "fr" ? "Corriger les données inexactes" : "Correct inaccurate personal data"}</li>
                <li>{language === "fr" ? "Demander la suppression de vos données" : "Request deletion of your personal data"}</li>
                <li>{language === "fr" ? "Vous opposer au traitement de vos données" : "Object to processing of your personal data"}</li>
                <li>{language === "fr" ? "Demander la limitation du traitement" : "Request restriction of processing your personal data"}</li>
                <li>{language === "fr" ? "Demander le transfert de vos données" : "Request transfer of your personal data"}</li>
                <li>{language === "fr" ? "Retirer votre consentement" : "Withdraw consent"}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                6. {language === "fr" ? "Conservation des Données" : "Data Retention"}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {language === "fr" 
                  ? "Nous conservons vos données personnelles uniquement le temps nécessaire pour vous fournir notre service et comme décrit dans cette Politique de Confidentialité. Nous conservons et utilisons également vos informations pour respecter nos obligations légales, résoudre les litiges et appliquer nos politiques."
                  : "We retain your personal data only for as long as necessary to provide you with our service and as described in this Privacy Policy. We will also retain and use your information to comply with our legal obligations, resolve disputes, and enforce our policies."}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                7. {language === "fr" ? "Nous Contacter" : "Contact Us"}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {language === "fr" 
                  ? "Si vous avez des questions sur cette Politique de Confidentialité, veuillez nous contacter à :"
                  : "If you have any questions about this Privacy Policy, please contact us at:"}
              </p>
              <p className="text-primary mt-2">privacy@contextlens.io</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
    </ErrorBoundary>
  );
};

export default Privacy;
