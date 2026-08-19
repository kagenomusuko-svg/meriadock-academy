export type UserStatus = 'active' | 'suspended' | 'inactive';

export interface User {
  id: string;
  status: UserStatus;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  display_name: string | null;
  phone: string | null;
  official_position: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: string;
  name: string;
  description: string | null;
  is_system_role: boolean;
  created_at: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string | null;
  category: string;
  created_at: string;
}

export interface RoleAssignment {
  id: string;
  user_id: string;
  role_id: string;
  scope_id: string | null;
  assigned_at: string;
  assigned_by: string | null;
  updated_at: string;
}

export interface Scope {
  id: string;
  code: string;
  scope_type: string;
  metadata: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  actor_id: string;
  action: string;
  resource_type: string;
  resource_id: string | null;
  resource_name: string | null;
  old_values: Record<string, any> | null;
  new_values: Record<string, any> | null;
  correlation_id: string | null;
  created_at: string;
}

export interface UserWithProfile extends User {
  user_profiles: UserProfile | null;
}

export interface UserRole {
  role_name: string;
  role_id: string;
  scope_id: string | null;
  scope_code: string | null;
  scope_type: string | null;
}

export interface AuthUser {
  id: string;
  email: string;
  user_metadata: Record<string, any>;
}
