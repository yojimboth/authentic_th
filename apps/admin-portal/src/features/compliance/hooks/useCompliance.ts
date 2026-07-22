import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { complianceService } from '../../../api/services/mockBackend';

export function useCompliance() {
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery({
    queryKey: ['compliance-requests'],
    queryFn: complianceService.getRequests,
  });

  const purgeMutation = useMutation({
    mutationFn: complianceService.getPurgeStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compliance-requests'] });
    },
  });

  const exportMutation = useMutation({
    mutationFn: complianceService.exportAuditLog,
  });

  return {
    requests: requests,
    isLoading,
    purge: purgeMutation.mutate,
    exportAudit: exportMutation.mutate,
    isPurging: purgeMutation.isPending,
    isExporting: exportMutation.isPending,
    purgeProgress: purgeMutation.isPending ? 100 : 0,
  };
}