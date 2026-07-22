import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { loyaltyService } from '../../../api/services/mockBackend';

export function useLoyalty() {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['loyalty'],
    queryFn: loyaltyService.get,
  });

  const updateMutation = useMutation({
    mutationFn: loyaltyService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loyalty'] });
    },
  });

  return {
    settings: settings,
    isLoading,
    updateSettings: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
}