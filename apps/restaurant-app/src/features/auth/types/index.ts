export interface RestaurantOwner {
  id: string;
  tenantId: string;
  fullName: string;
  email: string;
  phone?: string;
  role: 'owner' | 'manager';
  primaryAddress?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: RestaurantOwner;
}