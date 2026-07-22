export type RequestType = 'ACCESS' | 'FORGOTTEN';
export type RequestStatus = 'PENDING' | 'COMPLETED';

export interface ComplianceRequest {
  id: string;
  email: string;
  tenant: string;
  type: RequestType;
  status: RequestStatus;
}

export type AdminRole = 'FOUNDER' | 'CO_FOUNDER';

export interface AuthUser {
  sub: string;
  tid: string;
  role: AdminRole;
}