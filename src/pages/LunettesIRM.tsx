// LUNETTES IRM - Cabinet Dashboard Page
// CLP-LUNETTES-IRM-2026-001

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SEOHead from '@/components/layout/SEOHead';
import ErrorBoundary from '@/components/ui/error-boundary';
import { useLanguage } from '@/i18n/LanguageContext';
import { useCabinet } from '@/hooks/mri';
import {
  DeviceStatusCard,
  SubscriptionCard,
  ScanStatsCard,
  ProtocolSelector,
  CabinetSetupForm,
  SubscriptionPlans,
  AddMRIDeviceDialog,
} from '@/components/cabinet';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Glasses, 
  Activity, 
  Settings, 
  HelpCircle,
  Play,
  ArrowRight,
  Plus,
  CreditCard,
} from 'lucide-react';
import { toast } from 'sonner';
import type { User } from '@supabase/supabase-js';

function LunettesIRMContent() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [showPlans, setShowPlans] = useState(false);

  const {
    cabinet,
    devices,
    subscription,
    todayScans,
    monthlyStats,
    protocols,
    isLoading,
    createCabinet,
    addDevice,
  } = useCabinet();

  // Auth check
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsCheckingAuth(false);
      if (!session?.user) {
        navigate('/auth');
      }
    });

    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate('/auth');
      }
    });

    return () => authSub.unsubscribe();
  }, [navigate]);

  const handleCreateCabinet = async (data: Parameters<typeof createCabinet.mutateAsync>[0]) => {
    await createCabinet.mutateAsync(data);
  };

  const handleStartScan = (protocol: { id: string; name: string }) => {
    toast.info(
      language === 'fr' 
        ? `Démarrage du protocole: ${protocol.name}` 
        : `Starting protocol: ${protocol.name}`
    );
    navigate(`/vision-irm?protocol=${protocol.id}`);
  };

  const handleAddDevice = async (deviceData: {
    manufacturer: string;
    model: string;
    serial_number: string;
    device_type: string;
    ip_address?: string;
  }) => {
    if (addDevice) {
      await addDevice.mutateAsync({
        manufacturer: deviceData.manufacturer,
        model: deviceData.model,
        serial_number: deviceData.serial_number,
        device_type: deviceData.device_type,
        ip_address: deviceData.ip_address,
      });
      setShowAddDevice(false);
    }
  };

  if (isCheckingAuth || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  // No cabinet - show setup form
  if (!cabinet) {
    return (
      <div className="container mx-auto px-4 py-8">
        <CabinetSetupForm 
          onSubmit={handleCreateCabinet}
          isLoading={createCabinet.isPending}
        />
      </div>
    );
  }

  const mainDevice = devices[0] || null;

  // Show subscription plans selection if no subscription
  if (!subscription && showPlans) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => setShowPlans(false)} className="mb-6">
          ← {language === 'fr' ? 'Retour' : 'Back'}
        </Button>
        <SubscriptionPlans 
          onSelectPlan={(planId) => {
            toast.info(
              language === 'fr' 
                ? `Plan ${planId} sélectionné - Stripe bientôt disponible` 
                : `Plan ${planId} selected - Stripe coming soon`
            );
          }} 
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Add Device Dialog */}
      <AddMRIDeviceDialog
        open={showAddDevice}
        onOpenChange={setShowAddDevice}
        onAddDevice={handleAddDevice}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Glasses className="h-8 w-8 text-primary" />
            LUNETTES IRM
          </h1>
          <p className="text-muted-foreground mt-1">
            {cabinet.name}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowAddDevice(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {language === 'fr' ? 'Ajouter appareil' : 'Add Device'}
          </Button>
          <Button variant="outline" onClick={() => navigate('/settings')}>
            <Settings className="h-4 w-4 mr-2" />
            {language === 'fr' ? 'Paramètres' : 'Settings'}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => {
              toast.info(
                language === 'fr'
                  ? 'Documentation et support disponibles sur /docs'
                  : 'Documentation and support available at /docs'
              );
              navigate('/docs');
            }}
          >
            <HelpCircle className="h-4 w-4 mr-2" />
            {language === 'fr' ? 'Aide' : 'Help'}
          </Button>
        </div>
      </div>

      {/* Quick Start Banner */}
      {mainDevice?.status === 'online' && (
        <Card className="mb-6 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-full">
                <Play className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">
                  {language === 'fr' 
                    ? 'Appareil prêt pour les scans' 
                    : 'Device ready for scanning'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {language === 'fr' 
                    ? 'Sélectionnez un protocole pour commencer' 
                    : 'Select a protocol to begin'}
                </p>
              </div>
            </div>
            <Button onClick={() => navigate('/vision-irm')}>
              {language === 'fr' ? 'Lancer un scan' : 'Start scan'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* No subscription banner */}
      {!subscription && (
        <Card className="mb-6 border-accent/30 bg-accent/5">
          <CardContent className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/20 rounded-full">
                <CreditCard className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="font-medium">
                  {language === 'fr' 
                    ? 'Aucun abonnement actif' 
                    : 'No active subscription'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {language === 'fr' 
                    ? 'Choisissez un forfait pour commencer les scans' 
                    : 'Choose a plan to start scanning'}
                </p>
              </div>
            </div>
            <Button onClick={() => setShowPlans(true)}>
              {language === 'fr' ? 'Voir les forfaits' : 'View Plans'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">
            <Activity className="h-4 w-4 mr-2" />
            {language === 'fr' ? 'Vue d\'ensemble' : 'Overview'}
          </TabsTrigger>
          <TabsTrigger value="protocols">
            <Glasses className="h-4 w-4 mr-2" />
            {language === 'fr' ? 'Protocoles' : 'Protocols'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <DeviceStatusCard 
              device={mainDevice}
              onRefresh={() => {
                toast.info(language === 'fr' ? 'Actualisation...' : 'Refreshing...');
              }}
              onRequestMaintenance={() => {
                toast.info(
                  language === 'fr' 
                    ? 'Demande de maintenance envoyée' 
                    : 'Maintenance request sent'
                );
              }}
            />
            <SubscriptionCard 
              subscription={subscription}
              onManage={() => navigate('/settings?tab=billing')}
              onUpgrade={() => {
                toast.info(
                  language === 'fr' 
                    ? 'Contactez-nous pour upgrader' 
                    : 'Contact us to upgrade'
                );
              }}
            />
            <ScanStatsCard 
              todayScans={todayScans}
              monthlyStats={monthlyStats}
            />
          </div>
        </TabsContent>

        <TabsContent value="protocols">
          <div className="max-w-2xl">
            <ProtocolSelector 
              protocols={protocols}
              onSelectProtocol={handleStartScan}
              disabled={mainDevice?.status !== 'online'}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Vision Mission Statement */}
      <Card className="mt-8 bg-muted/30">
        <CardHeader>
          <CardTitle className="text-lg">
            {language === 'fr' 
              ? '"Voir l\'invisible pour prévenir l\'incurable"' 
              : '"See the invisible to prevent the incurable"'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            {language === 'fr' 
              ? 'LUNETTES IRM démocratise l\'imagerie médicale de prévention en rendant l\'IRM accessible à chaque cabinet médical, transformant ainsi la détection précoce des cancers et maladies chroniques.'
              : 'LUNETTES IRM democratizes preventive medical imaging by making MRI accessible to every medical practice, thereby transforming early detection of cancers and chronic diseases.'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LunettesIRM() {
  const { language } = useLanguage();
  
  return (
    <ErrorBoundary>
      <SEOHead 
        title={language === 'fr' ? 'LUNETTES IRM - Dashboard Cabinet' : 'LUNETTES IRM - Cabinet Dashboard'}
        description={language === 'fr' 
          ? 'Tableau de bord pour la gestion de votre cabinet médical équipé LUNETTES IRM'
          : 'Dashboard for managing your LUNETTES IRM equipped medical practice'}
      />
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1">
          <LunettesIRMContent />
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
