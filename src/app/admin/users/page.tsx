'use client';

import { createClient } from '@/lib/supabase/client';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Loading } from '@/components/Loading';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UserWithProfile } from '@/types';
import { AlertCircle, CheckCircle } from 'lucide-react';

export default function AdminUsersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [newStatus, setNewStatus] = useState('');
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState('');
  const [userRoles, setUserRoles] = useState<any[]>([]);
  const [availableRoles, setAvailableRoles] = useState<any[]>([]);
  const [selectedRoleToAssign, setSelectedRoleToAssign] = useState('');
  const [assigningRole, setAssigningRole] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      setCurrentUser(user);

      // Verificar permisos
      const hasPermission = await supabase.rpc('can_do', {
        p_permission_name: 'users.view_all',
      });

      if (!hasPermission?.data) {
        router.push('/dashboard');
        return;
      }

      // Obtener usuarios
      const { data: usersData, error } = await supabase
        .from('users')
        .select(
          `
          *,
          user_profiles(*)
        `
        )
        .order('created_at', { ascending: false });

      if (!error && usersData) {
        setUsers(usersData);
      }

      // Obtener roles disponibles
      const { data: rolesData } = await supabase
        .from('roles')
        .select('*')
        .order('name');

      if (rolesData) {
        setAvailableRoles(rolesData);
      }

      setLoading(false);
    };

    checkAuth();
  }, [router]);

  const loadUserRoles = async (userId: string) => {
    const supabase = createClient();
    const { data: rolesData } = await supabase
      .from('role_assignments')
      .select('*, roles(name, is_system_role)')
      .eq('user_id', userId);

    if (rolesData) {
      setUserRoles(rolesData);
    }
  };

  const handleSelectUser = async (user: any) => {
    setSelectedUser(user);
    setNewStatus('');
    setSelectedRoleToAssign('');
    setMessage('');
    await loadUserRoles(user.id);
  };

  const handleStatusChange = async () => {
    if (!selectedUser || !newStatus) return;

    setUpdating(true);
    setMessage('');

    try {
      const supabase = createClient();
      const success = await supabase.rpc('admin_update_user_status', {
        p_target_user_id: selectedUser.id,
        p_new_status: newStatus,
      });

      if (success?.data) {
        setMessage('Estado actualizado correctamente');
        // Actualizar la lista
        const updatedUsers = users.map((u) =>
          u.id === selectedUser.id
            ? { ...u, status: newStatus }
            : u
        );
        setUsers(updatedUsers);
        setSelectedUser({ ...selectedUser, status: newStatus });
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Error al actualizar el estado');
      }
    } catch (error) {
      setMessage('Error inesperado');
    } finally {
      setUpdating(false);
    }
  };

  const handleAssignRole = async () => {
    if (!selectedUser || !selectedRoleToAssign) return;

    setAssigningRole(true);
    setMessage('');

    try {
      const supabase = createClient();
      const result = await supabase.rpc('admin_assign_role', {
        p_target_user_id: selectedUser.id,
        p_role_name: selectedRoleToAssign,
        p_scope_id: null,
      });

      if (result.data) {
        setMessage('Rol asignado correctamente');
        setSelectedRoleToAssign('');
        await loadUserRoles(selectedUser.id);
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Error al asignar el rol');
      }
    } catch (error: any) {
      setMessage(error.message || 'Error inesperado');
    } finally {
      setAssigningRole(false);
    }
  };

  const handleRevokeRole = async (roleAssignmentId: string) => {
    if (!selectedUser) return;

    setAssigningRole(true);
    setMessage('');

    try {
      const supabase = createClient();
      const roleAssignment = userRoles.find((r) => r.id === roleAssignmentId);
      if (!roleAssignment) return;

      const result = await supabase.rpc('admin_revoke_role', {
        p_target_user_id: selectedUser.id,
        p_role_name: (roleAssignment.roles as any).name,
        p_scope_id: roleAssignment.scope_id,
      });

      if (result.data) {
        setMessage('Rol revocado correctamente');
        await loadUserRoles(selectedUser.id);
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Error al revocar el rol');
      }
    } catch (error: any) {
      setMessage(error.message || 'Error inesperado');
    } finally {
      setAssigningRole(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex">
        <Sidebar isAdmin={true} />
        <main className="flex-1">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Gestión de Usuarios
            </h1>
            <p className="text-gray-600 mb-8">
              Total de usuarios: {users.length}
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Lista de usuarios */}
              <div className="lg:col-span-2">
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left font-semibold text-gray-900">
                            Nombre
                          </th>
                          <th className="px-6 py-3 text-left font-semibold text-gray-900">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left font-semibold text-gray-900">
                            Estado
                          </th>
                          <th className="px-6 py-3 text-left font-semibold text-gray-900">
                            Creado
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {users.map((user) => {
                          const profile = user.user_profiles;
                          const displayName = profile?.display_name ||
                            profile?.first_name ||
                            'Sin nombre';
                          return (
                            <tr
                              key={user.id}
                              onClick={() => handleSelectUser(user)}
                              className={`cursor-pointer hover:bg-gray-50 transition ${
                                selectedUser?.id === user.id
                                  ? 'bg-institutional-dark/5'
                                  : ''
                              }`}
                            >
                              <td className="px-6 py-4 font-medium text-gray-900">
                                {displayName}
                              </td>
                              <td className="px-6 py-4 text-gray-600 text-xs break-all">
                                {user.email}
                              </td>
                              <td className="px-6 py-4">
                                <span
                                  className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                                    user.status === 'active'
                                      ? 'bg-green-100 text-green-800'
                                      : user.status === 'suspended'
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-gray-100 text-gray-800'
                                  }`}
                                >
                                  {user.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-gray-600 text-xs">
                                {new Date(
                                  user.created_at
                                ).toLocaleDateString('es-ES')}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Detalle del usuario */}
              <div className="lg:col-span-1">
                {selectedUser ? (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Detalles del usuario
                    </h2>

                    {message && (
                      <div
                        className={`mb-4 p-3 rounded text-sm ${
                          message.includes('Error')
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {message}
                      </div>
                    )}

                    <div className="space-y-4 mb-6">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">
                          Nombre
                        </p>
                        <p className="text-sm text-gray-900 mt-1">
                          {selectedUser.user_profiles?.display_name ||
                            selectedUser.user_profiles?.first_name ||
                            'Sin nombre'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">
                          Email
                        </p>
                        <p className="text-xs text-gray-600 mt-1 break-all font-mono">
                          {selectedUser.email}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">
                          Usuario ID
                        </p>
                        <p className="text-xs text-gray-600 mt-1 break-all font-mono">
                          {selectedUser.id}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">
                          Creado
                        </p>
                        <p className="text-sm text-gray-900 mt-1">
                          {new Date(
                            selectedUser.created_at
                          ).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    </div>

                    {/* Cambiar estado */}
                    <div className="border-t border-gray-200 pt-6">
                      <label className="label-field">Cambiar estado</label>
                      <select
                        value={newStatus || selectedUser.status}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="input-field mb-3"
                        disabled={updating || assigningRole}
                      >
                        <option value="">Seleccionar...</option>
                        <option value="active">Activo</option>
                        <option value="suspended">Suspendido</option>
                        <option value="inactive">Inactivo</option>
                      </select>
                      <button
                        onClick={handleStatusChange}
                        disabled={!newStatus || updating || assigningRole}
                        className="btn-primary w-full"
                      >
                        {updating ? 'Actualizando...' : 'Actualizar'}
                      </button>
                    </div>

                    {/* Gestión de roles */}
                    <div className="border-t border-gray-200 pt-6 mt-6">
                      <h3 className="text-sm font-semibold text-gray-900 mb-4">
                        Roles del usuario
                      </h3>

                      {/* Roles actuales */}
                      {userRoles.length > 0 ? (
                        <div className="mb-4">
                          <div className="space-y-2">
                            {userRoles.map((roleAssignment) => {
                              const role = (roleAssignment.roles as any);
                              const isSystemAdmin = role?.name === 'system_admin';
                              const canRevoke =
                                currentUser?.id !== selectedUser.id &&
                                !isSystemAdmin;

                              return (
                                <div
                                  key={roleAssignment.id}
                                  className="flex items-center justify-between bg-gray-50 p-3 rounded text-sm"
                                >
                                  <div>
                                    <span className="font-medium text-gray-900">
                                      {role?.name}
                                    </span>
                                    {isSystemAdmin && (
                                      <span className="ml-2 inline-flex px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded">
                                        Sistema
                                      </span>
                                    )}
                                  </div>
                                  {canRevoke && (
                                    <button
                                      onClick={() =>
                                        handleRevokeRole(roleAssignment.id)
                                      }
                                      disabled={assigningRole}
                                      className="text-xs text-red-600 hover:text-red-800 font-medium"
                                    >
                                      Revocar
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600 mb-4">
                          Sin roles asignados
                        </p>
                      )}

                      {/* Asignar rol */}
                      {currentUser?.id !== selectedUser.id &&
                        !userRoles.some(
                          (r) => (r.roles as any)?.name === 'system_admin'
                        ) && (
                          <div>
                            <label className="label-field">Asignar rol</label>
                            <select
                              value={selectedRoleToAssign}
                              onChange={(e) =>
                                setSelectedRoleToAssign(e.target.value)
                              }
                              className="input-field mb-3"
                              disabled={assigningRole}
                            >
                              <option value="">Seleccionar...</option>
                              {availableRoles
                                .filter(
                                  (role) => role.name !== 'system_admin'
                                )
                                .map((role) => (
                                  <option key={role.id} value={role.name}>
                                    {role.name}
                                  </option>
                                ))}
                            </select>
                            <button
                              onClick={handleAssignRole}
                              disabled={!selectedRoleToAssign || assigningRole}
                              className="btn-primary w-full"
                            >
                              {assigningRole
                                ? 'Asignando...'
                                : 'Asignar rol'}
                            </button>
                          </div>
                        )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <p className="text-gray-600">
                      Selecciona un usuario para ver detalles
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
