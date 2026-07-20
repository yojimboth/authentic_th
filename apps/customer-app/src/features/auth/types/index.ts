/**
 * Authentication Type Definitions
 * 
 * Core types for the passwordless email OTP authentication system.
 * Used by mockAuth utilities, Zustand stores, and screen components.
 */

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  loyaltyPoints: number;
  primaryAddress?: string;
  isComplete: boolean;
}

export interface UserSession {
  accessToken: string;
  refreshToken: string;
  user: UserProfile;
  isAuthenticated: boolean;
}

export interface RequestCodeRequest {
  email: string;
}

export interface RequestCodeResponse {
  sent: true;
  email: string;
  codeExpiresIn: number;
}

export interface VerifyCodeRequest {
  email: string;
  code: string;
}

export interface VerifyCodeResponse {
  valid: true;
  requiresProfile: boolean;
  user?: UserProfile;
}

export interface CompleteProfileRequest {
  name: string;
  phone: string;
  email: string;
}

export interface CompleteProfileResponse {
  user: UserProfile;
  accessToken: string;
  refreshToken: string;
}

export interface GuestSession {
  isGuest: true;
  cartPreserved: boolean;
}

export type AuthStatus =
  | 'idle'
  | 'checking'
  | 'unauthenticated'
  | 'guest'
  | 'member'
  | 'profile-pending';

export interface AuthState {
  status: AuthStatus;
  session: UserSession | null;
  guest: GuestSession | null;

  initialize: () => Promise<void>;
  requestCode: (email: string) => Promise<{ sent: true } | { error: string }>;
  verifyCode: (
    email: string,
    code: string
  ) => Promise<{ requiresProfile?: boolean; user?: UserProfile; error?: string }>;
  completeProfile: (data: CompleteProfileRequest) => Promise<UserSession>;
  setGuest: () => void;
  logout: () => Promise<void>;
  clearSession: () => void;

  isGuest: () => boolean;
  isMember: () => boolean;
  requiresProfile: () => boolean;
  isAuthenticated: () => boolean;
}