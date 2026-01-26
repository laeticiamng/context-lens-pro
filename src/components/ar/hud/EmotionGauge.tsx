import { EmotionData, EmotionType } from '@/stores/arStore';
import { useLanguage } from '@/i18n/LanguageContext';

interface EmotionGaugeProps {
  emotions: EmotionData;
}

const EMOTION_CONFIG: Record<EmotionType, { labelFr: string; labelEn: string; color: string }> = {
  anxiety: { labelFr: 'Anxiété', labelEn: 'Anxiety', color: '#EF4444' },
  joy: { labelFr: 'Joie', labelEn: 'Joy', color: '#10B981' },
  sadness: { labelFr: 'Tristesse', labelEn: 'Sadness', color: '#3B82F6' },
  anger: { labelFr: 'Colère', labelEn: 'Anger', color: '#F59E0B' },
  disgust: { labelFr: 'Dégoût', labelEn: 'Disgust', color: '#8B5CF6' }
};

export function EmotionGauge({ emotions }: EmotionGaugeProps) {
  const { language } = useLanguage();

  // Sort emotions by intensity
  const sortedEmotions = Object.entries(emotions)
    .filter(([key]) => key !== 'timestamp')
    .sort(([, a], [, b]) => (b as number) - (a as number)) as [EmotionType, number][];

  return (
    <div className="pointer-events-auto p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 shadow-xl">
      <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
        {language === 'fr' ? 'Émotions' : 'Emotions'}
      </h3>

      <div className="space-y-3">
        {sortedEmotions.map(([emotion, value]) => {
          const config = EMOTION_CONFIG[emotion];
          const percentage = Math.round(value * 100);
          
          return (
            <div key={emotion} className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-white/80">
                  {language === 'fr' ? config.labelFr : config.labelEn}
                </span>
                <span className="text-white/60 font-mono">{percentage}%</span>
              </div>
              
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300 ease-out"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: config.color,
                    boxShadow: `0 0 10px ${config.color}50`
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Dominant emotion indicator */}
      {sortedEmotions.length > 0 && sortedEmotions[0][1] > 0.5 && (
        <div 
          className="mt-4 pt-3 border-t border-white/10 text-center"
          style={{ color: EMOTION_CONFIG[sortedEmotions[0][0]].color }}
        >
          <span className="text-xs uppercase tracking-wider">
            {language === 'fr' ? 'Dominante: ' : 'Dominant: '}
            {language === 'fr' 
              ? EMOTION_CONFIG[sortedEmotions[0][0]].labelFr 
              : EMOTION_CONFIG[sortedEmotions[0][0]].labelEn
            }
          </span>
        </div>
      )}
    </div>
  );
}
