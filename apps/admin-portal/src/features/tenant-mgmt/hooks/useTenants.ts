import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantService } from '../../../api/services/mockBackend';
import type { Tenant } from '../../../types/tenant';

export function useTenants() {
  const queryClient = useQueryClient();

  const { data: tenants, isLoading } = useQuery({
    queryKey: ['tenants'],
    queryFn: tenantService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: tenantService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
  });

  const suspendMutation = useMutation({
    mutationFn: tenantService.suspend,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
  });

  const activateMutation = useMutation({
    mutationFn: tenantService.activate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: tenantService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
  });

  return {
    tenants: tenants as Tenant[],
    isLoading,
    createTenant: createMutation.mutate,
    suspendTenant: suspendMutation.mutate,
    activateTenant: activateMutation.mutate,
    deleteTenant: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isSuspendLoading: suspendMutation.isPending,
    isActivateLoading: activateMutation.isPending,
    isDeleteLoading: deleteMutation.isPending,
  };
}