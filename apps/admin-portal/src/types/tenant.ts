export type TenantStatus = 'Active' | 'Suspended' | 'Pending';

export interface Tenant {
  id: string;
  name: string;
  domain: string;
  status: TenantStatus;
  createdAt: string;
}

export interface CreateTenantDto {
  name: string;
  domain: string;
}

export interface TenantFormData {
  name: string;
  domain: string;
}