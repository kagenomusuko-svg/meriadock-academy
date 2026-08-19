import { createClient } from '@/lib/supabase/client';
import { UserRole, UserStatus } from '@/types';

export async function canDo(permission: string): Promise<boolean> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('can_do', {
    p_permission_name: permission,
  });

  if (error) {
    console.error('Error checking permission:', error);
    return false;
  }

  return data ?? false;
}

export async function canDoInScope(
  permission: string,
  scopeId: string
): Promise<boolean> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('can_do_in_scope', {
    p_permission_name: permission,
    p_scope_id: scopeId,
  });

  if (error) {
    console.error('Error checking permission in scope:', error);
    return false;
  }

  return data ?? false;
}

export async function getMyRoles(): Promise<UserRole[]> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('get_my_roles');

  if (error) {
    console.error('Error fetching roles:', error);
    return [];
  }

  return data ?? [];
}

export async function getMyAccountStatus(): Promise<{ id: string; status: UserStatus } | null> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('get_my_account_status');

  if (error) {
    console.error('Error fetching account status:', error);
    return null;
  }

  return data?.[0] ?? null;
}

export async function assignRole(
  targetUserId: string,
  roleName: string,
  scopeId?: string
): Promise<string | null> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('admin_assign_role', {
    p_target_user_id: targetUserId,
    p_role_name: roleName,
    p_scope_id: scopeId || null,
  });

  if (error) {
    console.error('Error assigning role:', error);
    return null;
  }

  return data;
}

export async function revokeRole(
  targetUserId: string,
  roleName: string,
  scopeId?: string
): Promise<boolean> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('admin_revoke_role', {
    p_target_user_id: targetUserId,
    p_role_name: roleName,
    p_scope_id: scopeId || null,
  });

  if (error) {
    console.error('Error revoking role:', error);
    return false;
  }

  return data ?? false;
}

export async function updateUserStatus(
  targetUserId: string,
  newStatus: 'active' | 'suspended' | 'inactive'
): Promise<boolean> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('admin_update_user_status', {
    p_target_user_id: targetUserId,
    p_new_status: newStatus,
  });

  if (error) {
    console.error('Error updating user status:', error);
    return false;
  }

  return data ?? false;
}
