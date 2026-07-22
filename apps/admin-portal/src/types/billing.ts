export type FeeType = 'PERCENTAGE' | 'FIXED';

export interface FeeConfig {
  type: FeeType;
  value: number;
  currency: string;
}

export interface FeeStructure {
  platformFee: FeeConfig;
  adminFee: FeeConfig;
  transactionFee: FeeConfig;
}

export interface BillingFormData {
  platformFee: FeeConfig;
  adminFee: FeeConfig;
  transactionFee: FeeConfig;
}