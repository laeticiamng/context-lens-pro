// Cabinet Setup Form Component
// CLP-LUNETTES-IRM-2026-001

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Loader2, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { toast } from 'sonner';
import { z } from 'zod';

const cabinetSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }).max(100),
  address: z.string().max(200).optional().or(z.literal('')),
  city: z.string().max(100).optional().or(z.literal('')),
  postal_code: z.string().regex(/^[0-9]{5}$/, { message: 'Invalid postal code' }).optional().or(z.literal('')),
  phone: z.string().regex(/^(\+33|0)[1-9][0-9]{8}$/, { message: 'Invalid phone number' }).optional().or(z.literal('')),
  email: z.string().email({ message: 'Invalid email' }).optional().or(z.literal('')),
  siret: z.string().regex(/^[0-9]{14}$/, { message: 'SIRET must be 14 digits' }).optional().or(z.literal('')),
});

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
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Validate with Zod
    const result = cabinetSchema.safeParse(formData);
    
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = language === 'fr' 
            ? getErrorFr(err.message) 
            : err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      // Filter out empty strings
      const cleanData = Object.fromEntries(
        Object.entries(formData).filter(([_, v]) => v !== '')
      ) as typeof formData;
      
      await onSubmit(cleanData);
      toast.success(
        language === 'fr' 
          ? 'Cabinet créé avec succès' 
          : 'Cabinet created successfully'
      );
    } catch {
      toast.error(
        language === 'fr' 
          ? 'Erreur lors de la création' 
          : 'Error creating cabinet'
      );
    }
  };

  const getErrorFr = (msg: string): string => {
    const translations: Record<string, string> = {
      'Name must be at least 2 characters': 'Le nom doit contenir au moins 2 caractères',
      'Invalid postal code': 'Code postal invalide (5 chiffres)',
      'Invalid phone number': 'Numéro de téléphone invalide',
      'Invalid email': 'Email invalide',
      'SIRET must be 14 digits': 'Le SIRET doit contenir 14 chiffres',
    };
    return translations[msg] || msg;
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
            <Label htmlFor="name" className="flex items-center gap-1">
              {language === 'fr' ? 'Nom du cabinet' : 'Cabinet name'}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={language === 'fr' ? 'Cabinet du Dr. Martin' : "Dr. Martin's Practice"}
              className={errors.name ? 'border-destructive' : ''}
              required
            />
            {errors.name && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.name}
              </p>
            )}
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
                className={errors.postal_code ? 'border-destructive' : ''}
              />
              {errors.postal_code && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.postal_code}
                </p>
              )}
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
                className={errors.phone ? 'border-destructive' : ''}
              />
              {errors.phone && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.phone}
                </p>
              )}
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
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.email}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="siret">SIRET</Label>
              <Input
                id="siret"
                value={formData.siret}
                onChange={(e) => setFormData({ ...formData, siret: e.target.value.replace(/\s/g, '') })}
                placeholder="12345678900012"
                maxLength={14}
                className={errors.siret ? 'border-destructive' : ''}
              />
              {errors.siret && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.siret}
                </p>
              )}
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
