import { PatientData } from '@/stores/arStore';
import { useLanguage } from '@/i18n/LanguageContext';
import { User, Calendar, FileText } from 'lucide-react';

interface PatientCardProps {
  patient: PatientData;
}

export function PatientCard({ patient }: PatientCardProps) {
  const { language } = useLanguage();

  return (
    <div className="pointer-events-auto p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 shadow-xl">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center">
          <User className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-white font-semibold">{patient.name}</h3>
          <p className="text-xs text-white/60">
            {patient.age} {language === 'fr' ? 'ans' : 'y/o'}, {patient.gender}
          </p>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-white/70">
          <Calendar className="h-4 w-4" />
          <span>
            {language === 'fr' ? 'Dernière session: ' : 'Last session: '}
            {new Date(patient.lastSession).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}
          </span>
        </div>
        
        {patient.diagnosis && (
          <div className="flex items-start gap-2 text-white/70">
            <FileText className="h-4 w-4 mt-0.5" />
            <span className="text-xs">{patient.diagnosis}</span>
          </div>
        )}
      </div>
    </div>
  );
}
