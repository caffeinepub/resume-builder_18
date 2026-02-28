import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Resume } from '../backend';

export function useGetResume(sessionToken: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Resume | null>({
    queryKey: ['resume', sessionToken],
    queryFn: async () => {
      if (!actor || !sessionToken) return null;
      try {
        return await actor.getResume(sessionToken);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!sessionToken,
  });
}

export function useSaveResume(sessionToken: string) {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (resume: Resume) => {
      if (!actor) throw new Error('Actor not initialized');
      if (!sessionToken) throw new Error('No session token');
      await actor.saveResume(sessionToken, resume);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resume', sessionToken] });
    },
  });
}
