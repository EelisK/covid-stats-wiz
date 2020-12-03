export enum UserRole {
  VIEWER = 'VIEWER',
  EDITOR = 'EDITOR',
}

export interface StatsWizUser {
  displayName: string;
  email: string;
  uid: string;
  role: UserRole;
}
