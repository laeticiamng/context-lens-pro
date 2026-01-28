// Email Verification Status Component
// Shows verification status with resend option

import { useState, useEffect } from 'react';
import { Mail, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/i18n/LanguageContext';

interface EmailVerificationStatusProps {
  email: string;
  isVerified: boolean;
}

export function EmailVerificationStatus({ email, isVerified }: EmailVerificationStatusProps) {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleResend = async () => {
    if (cooldown > 0) return;
    
    setIsSending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) throw error;

      toast({
        title: language === 'fr' ? 'Email envoyé' : 'Email sent',
        description: language === 'fr' 
          ? 'Vérifiez votre boîte de réception.'
          : 'Check your inbox.',
      });
      
      setCooldown(60); // 60 second cooldown
    } catch (error) {
      toast({
        title: language === 'fr' ? 'Erreur' : 'Error',
        description: language === 'fr'
          ? 'Impossible d\'envoyer l\'email. Réessayez.'
          : 'Failed to send email. Try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  const t = {
    verified: language === 'fr' ? 'Email vérifié' : 'Email verified',
    verifiedDesc: language === 'fr'
      ? 'Votre adresse email a été vérifiée.'
      : 'Your email address has been verified.',
    unverified: language === 'fr' ? 'Email non vérifié' : 'Email not verified',
    unverifiedDesc: language === 'fr'
      ? 'Veuillez vérifier votre email pour accéder à toutes les fonctionnalités.'
      : 'Please verify your email to access all features.',
    resend: language === 'fr' ? 'Renvoyer l\'email' : 'Resend email',
    sending: language === 'fr' ? 'Envoi...' : 'Sending...',
    wait: language === 'fr' ? 'Attendre' : 'Wait',
  };

  if (isVerified) {
    return (
      <Alert variant="default" className="border-primary/30 bg-primary/10">
        <Check className="h-4 w-4 text-primary" />
        <AlertTitle className="text-primary">{t.verified}</AlertTitle>
        <AlertDescription className="text-muted-foreground text-sm">
          {t.verifiedDesc}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert variant="default" className="border-accent/30 bg-accent/10">
      <Mail className="h-4 w-4 text-accent" />
      <AlertTitle className="text-accent">{t.unverified}</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span className="text-muted-foreground text-sm">{t.unverifiedDesc}</span>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleResend}
          disabled={isSending || cooldown > 0}
          className="ml-4 shrink-0"
        >
          {isSending ? (
            <>
              <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
              {t.sending}
            </>
          ) : cooldown > 0 ? (
            `${t.wait} ${cooldown}s`
          ) : (
            <>
              <Mail className="h-3 w-3 mr-1" />
              {t.resend}
            </>
          )}
        </Button>
      </AlertDescription>
    </Alert>
  );
}
