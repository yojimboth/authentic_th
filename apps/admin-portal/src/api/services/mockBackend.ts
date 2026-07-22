import api from '../client';
import type { Tenant, CreateTenantDto } from '../../types/tenant';
import type { FeeStructure } from '../../types/billing';
import type { HealthMetrics, KPIMetrics, Alert } from '../../types/health';
import type { LoyaltySettings } from '../../types/loyalty';
import type { ComplianceRequest } from '../../types/auth';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock data stores
const mockTenants: Tenant[] = [
  { id: '1', name: 'Siam Authentic', domain: 'siamauthentic.com', status: 'Active', createdAt: '2024-01-15' },
  { id: '2', name: 'Thai Garden', domain: 'thaigarden.com', status: 'Active', createdAt: '2024-02-20' },
  { id: '3', name: 'Bangkok Bites', domain: 'bangkokbites.com', status: 'Suspended', createdAt: '2024-03-10' },
  { id: '4', name: 'Chiang Mai Kitchen', domain: 'chiangmai.com', status: 'Active', createdAt: '2024-04-05' },
  { id: '5', name: 'Pattaya Pirates', domain: 'pattayapirates.com', status: 'Pending', createdAt: '2024-05-01' },
];

const mockFeeConfig: FeeStructure = {
  platformFee: { type: 'PERCENTAGE', value: 15, currency: 'AUD' },
  adminFee: { type: 'FIXED', value: 50, currency: 'AUD' },
  transactionFee: { type: 'PERCENTAGE', value: 2.9, currency: 'AUD' },
};

const mockLoyalty: LoyaltySettings = {
  conversionRate: 1.0,
  allowOverride: false,
};

const mockHealth: HealthMetrics = {
  cpuUsage: 45,
  memoryUsage: 62,
  apiLatencyMs: 234,
  dbConnections: 12,
  timestamp: new Date().toISOString(),
};

const mockAlerts: Alert[] = [
  { id: 'a1', tenantName: 'Siam Authentic', message: 'Rate limit threshold at 85%', severity: 'warning', timestamp: new Date(Date.now() - 300000).toISOString() },
  { id: 'a2', tenantName: 'Bangkok Bites', message: 'Subscription expiring in 7 days', severity: 'info', timestamp: new Date(Date.now() - 600000).toISOString() },
  { id: 'a3', tenantName: 'Thai Garden', message: 'API latency spike detected (520ms)', severity: 'critical', timestamp: new Date(Date.now() - 120000).toISOString() },
];

const mockRequests: ComplianceRequest[] = [
  { id: 'REQ-001', email: 'john@email.com', tenant: 'Siam Authentic', type: 'ACCESS', status: 'PENDING' },
  { id: 'REQ-002', email: 'jane@email.com', tenant: 'Thai Garden', type: 'FORGOTTEN', status: 'PENDING' },
  { id: 'REQ-003', email: 'bob@email.com', tenant: 'Bangkok Bites', type: 'ACCESS', status: 'COMPLETED' },
];

// Tenant services
export const tenantService = {
  getAll: async (): Promise<Tenant[]> => {
    await delay(600);
    return [...mockTenants];
  },
  getById: async (id: string): Promise<Tenant | undefined> => {
    await delay(500);
    return mockTenants.find((t) => t.id === id);
  },
  create: async (data: CreateTenantDto): Promise<Tenant> => {
    await delay(800);
    const newTenant: Tenant = {
      id: String(mockTenants.length + 1),
      ...data,
      status: 'Pending',
      createdAt: new Date().toISOString().split('T')[0],
    };
    mockTenants.push(newTenant);
    return { ...newTenant };
  },
  suspend: async (id: string): Promise<Tenant> => {
    await delay(700);
    const idx = mockTenants.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error('Tenant not found');
    mockTenants[idx].status = 'Suspended';
    return { ...mockTenants[idx] };
  },
  activate: async (id: string): Promise<Tenant> => {
    await delay(700);
    const idx = mockTenants.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error('Tenant not found');
    mockTenants[idx].status = 'Active';
    return { ...mockTenants[idx] };
  },
  delete: async (id: string): Promise<void> => {
    await delay(800);
    const idx = mockTenants.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error('Tenant not found');
    mockTenants.splice(idx, 1);
  },
};

// Billing services
export const billingService = {
  get: async (): Promise<FeeStructure> => {
    await delay(500);
    return { ...mockFeeConfig };
  },
  update: async (data: Partial<FeeStructure>): Promise<FeeStructure> => {
    await delay(900);
    Object.assign(mockFeeConfig, data);
    return { ...mockFeeConfig };
  },
};

// Loyalty services
export const loyaltyService = {
  get: async (): Promise<LoyaltySettings> => {
    await delay(500);
    return { ...mockLoyalty };
  },
  update: async (data: Partial<LoyaltySettings>): Promise<LoyaltySettings> => {
    await delay(800);
    Object.assign(mockLoyalty, data);
    return { ...mockLoyalty };
  },
};

// Health/Dashboard services
export const healthService = {
  getMetrics: async (): Promise<HealthMetrics> => {
    await delay(600);
    return {
      ...mockHealth,
      cpuUsage: 30 + Math.random() * 40,
      memoryUsage: 50 + Math.random() * 30,
      apiLatencyMs: 150 + Math.random() * 300,
      timestamp: new Date().toISOString(),
    };
  },
  getKPIs: async (): Promise<KPIMetrics> => {
    await delay(700);
    return {
      totalGMV: 1200000,
      activeTenants: mockTenants.filter((t) => t.status === 'Active').length,
      platformRevenue: 45000,
      avgLatencyMs: 234,
    };
  },
  getAlerts: async (): Promise<Alert[]> => {
    await delay(500);
    return [...mockAlerts];
  },
  getLatencyHistory: async (): Promise<{ time: string; latency: number }[]> => {
    await delay(500);
    const now = Date.now();
    return Array.from({ length: 24 }, (_, i) => ({
      time: new Date(now - (23 - i) * 3600000).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' }),
      latency: 100 + Math.random() * 400 + (i > 18 ? 200 : 0),
    }));
  },
};

// Compliance services
export const complianceService = {
  getRequests: async (): Promise<ComplianceRequest[]> => {
    await delay(600);
    return [...mockRequests];
  },
  getPurgeStatus: async (): Promise<{ completed: boolean; message: string }> => {
    await delay(2000);
    return { completed: true, message: 'Hard purge completed successfully' };
  },
  exportAuditLog: async (): Promise<Blob> => {
    await delay(1000);
    return new Blob(['audit log data'], { type: 'text/plain' });
  },
};