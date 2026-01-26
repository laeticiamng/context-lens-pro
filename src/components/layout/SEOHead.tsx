import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  noIndex?: boolean;
}

const SEOHead = ({ 
  title = "ContextLens - AI Contextual Prompter for Smart Glasses",
  description = "Transform any smart glasses into an AI-powered teleprompter. ContextLens displays relevant information based on what you see, hear, and do — in real-time.",
  image = "https://lovable.dev/opengraph-image-p98pqg.png",
  url = "https://contextlens.app",
  type = "website",
  noIndex = false,
}: SEOHeadProps) => {
  const fullTitle = title.includes("ContextLens") ? title : `${title} | ContextLens`;
  
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="ContextLens" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Canonical */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default SEOHead;
