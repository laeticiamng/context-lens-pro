import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { emotionsCareApi } from '@/services/emotionscare/api';
import type { Note, ARContext } from '@/services/emotionscare/types';
import { toast } from 'sonner';

// ============ NOTES HOOK ============

interface UseNotesResult {
  notes: Note[];
  isLoading: boolean;
  error: Error | null;
  addNote: (content: string, arContext?: ARContext) => Promise<Note | null>;
  isAdding: boolean;
}

export function useNotes(patientId: string | null): UseNotesResult {
  const queryClient = useQueryClient();
  
  // Query for existing notes
  const notesQuery = useQuery({
    queryKey: ['emotionscare', 'patient-notes', patientId],
    queryFn: () => emotionsCareApi.getPatientNotes(patientId!),
    enabled: !!patientId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // Mutation for adding notes
  const addNoteMutation = useMutation({
    mutationFn: async ({ content, arContext }: { content: string; arContext?: ARContext }) => {
      if (!patientId) throw new Error('No patient selected');
      return emotionsCareApi.createNote(patientId, content, arContext);
    },
    onSuccess: (newNote) => {
      // Optimistically update the cache
      queryClient.setQueryData<Note[]>(
        ['emotionscare', 'patient-notes', patientId],
        (old) => old ? [newNote, ...old] : [newNote]
      );
      
      toast.success('Note enregistrée', {
        description: 'La note clinique a été sauvegardée.',
      });
    },
    onError: (error) => {
      console.error('Failed to save note:', error);
      toast.error('Erreur', {
        description: 'Impossible de sauvegarder la note.',
      });
    },
  });

  const addNote = async (content: string, arContext?: ARContext): Promise<Note | null> => {
    try {
      const result = await addNoteMutation.mutateAsync({ content, arContext });
      return result;
    } catch {
      return null;
    }
  };

  return {
    notes: notesQuery.data || [],
    isLoading: notesQuery.isLoading,
    error: notesQuery.error as Error | null,
    addNote,
    isAdding: addNoteMutation.isPending,
  };
}

// ============ VOICE NOTE HOOK ============

interface UseVoiceNoteResult {
  saveVoiceNote: (transcript: string, region?: string) => Promise<void>;
  isSaving: boolean;
}

export function useVoiceNote(patientId: string | null): UseVoiceNoteResult {
  const { addNote, isAdding } = useNotes(patientId);

  const saveVoiceNote = async (transcript: string, region?: string) => {
    const arContext: ARContext = {
      focused_region: region,
      session_id: `ar-session-${Date.now()}`,
    };
    
    await addNote(transcript, arContext);
  };

  return {
    saveVoiceNote,
    isSaving: isAdding,
  };
}
