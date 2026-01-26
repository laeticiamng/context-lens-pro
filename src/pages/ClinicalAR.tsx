import { useParams } from 'react-router-dom';
import { ClinicalARView } from '@/components/ar/ClinicalARView';

export default function ClinicalAR() {
  const { patientId } = useParams<{ patientId?: string }>();

  return <ClinicalARView patientId={patientId} />;
}
