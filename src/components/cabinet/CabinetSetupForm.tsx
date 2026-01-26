// Cabinet Setup Form Component
// CLP-LUNETTES-IRM-2026-001

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Loader2 } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { toast } from 'sonner';

interface CabinetSetupFormProps {
  onSubmit: (data: {
    name: string;
    address?: string;
    city?: string;
    postal_code?: string;
    phone?: string;
    email?: string;
    siret?: string;
  }) => Promise<void>;
  isLoading?: boolean;
}

export function CabinetSetupForm({ onSubmit, isLoading }: CabinetSetupFormProps) {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    postal_code: '',
    phone: '',
    email: '',
    siret: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error(language === 'fr' ? 'Le nom est requis' : 'Name is required');
      return;
    }

    try {
      await onSubmit(formData);
      toast.success(
        language === 'fr' 
          ? 'Cabinet créé avec succès' 
          : 'Cabinet created successfully'
      );
    } catch (error) {
      toast.error(
        language === 'fr' 
          ? 'Erreur lors de la création' 
          : 'Error creating cabinet'
      );
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Building2 className="h-6 w-6 text-primary" />
        </div>
        <CardTitle>
          {language === 'fr' ? 'Créer votre cabinet' : 'Create your cabinet'}
        </CardTitle>
        <CardDescription>
          {language === 'fr' 
            ? 'Configurez votre cabinet médical pour commencer à utiliser LUNETTES IRM'
            : 'Set up your medical practice to start using LUNETTES IRM'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              {language === 'fr' ? 'Nom du cabinet *' : 'Cabinet name *'}
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={language === 'fr' ? 'Cabinet du Dr. Martin' : "Dr. Martin's Practice"}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="address">
                {language === 'fr' ? 'Adresse' : 'Address'}
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="123 rue de la Santé"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">
                {language === 'fr' ? 'Ville' : 'City'}
              </Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Paris"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="postal_code">
                {language === 'fr' ? 'Code postal' : 'Postal code'}
              </Label>
              <Input
                id="postal_code"
                value={formData.postal_code}
                onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                placeholder="75001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">
                {language === 'fr' ? 'Téléphone' : 'Phone'}
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+33 1 23 45 67 89"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">
                {language === 'fr' ? 'Email professionnel' : 'Professional email'}
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contact@cabinet.fr"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siret">
                SIRET
              </Label>
              <Input
                id="siret"
                value={formData.siret}
                onChange={(e) => setFormData({ ...formData, siret: e.target.value })}
                placeholder="123 456 789 00012"
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {language === 'fr' ? 'Créer le cabinet' : 'Create cabinet'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
