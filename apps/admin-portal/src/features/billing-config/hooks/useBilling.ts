import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { billingService } from '../../../api/services/mockBackend';
import type { FeeStructure } from '../../../types/billing';

export function useBilling() {
  const queryClient = useQueryClient();

  const { data: feeConfig, isLoading } = useQuery({
    queryKey: ['billing'],
    queryFn: billingService.get,
  });

  const updateMutation = useMutation({
    mutationFn: billingService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing'] });
    },
  });

  return {
    feeConfig: feeConfig as FeeStructure,
    isLoading,
    updateFeeConfig: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
}