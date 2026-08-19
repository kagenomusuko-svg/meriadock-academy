'use client';

import { createClient } from '@/lib/supabase/client';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Loading } from '@/components/Loading';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Role } from '@/types';

export default function AdminRolesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [roleAssignments, setRoleAssignments] = useState<any[]>([]);

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

      // Verificar permisos
      const hasPermission = await supabase.rpc('can_do', {
        p_permission_name: 'permissions.view',
      });

      if (!hasPermission?.data) {
        router.push('/dashboard');
        return;
      }

      // Obtener roles
      const { data: rolesData } = await supabase
        .from('roles')
        .select('*')
        .order('name');

      if (rolesData) {
        setRoles(rolesData);
        if (rolesData.length > 0) {
          selectRole(rolesData[0]);
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, [router]);

  const selectRole = async (role: Role) => {
    setSelectedRole(role);

    const supabase = createClient();
    const { data: assignments } = await supabase
      .from('role_assignments')
      .select(
        `
        *,
        users(email),
        user_profiles(first_name, last_name, display_name)
      `
      )
      .eq('role_id', role.id);

    if (assignments) {
      setRoleAssignments(assignments);
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
              Gestión de Roles
            </h1>
            <p className="text-gray-600 mb-8">
              Total de roles: {roles.length}
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Lista de roles */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <div className="space-y-1 p-4">
                    {roles.map((role) => (
                      <button
                        key={role.id}
                        onClick={() => selectRole(role)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition ${
                          selectedRole?.id === role.id
                            ? 'bg-institutional-dark text-white'
                            : 'hover:bg-gray-200'
                        }`}
                      >
                        <div className="font-medium capitalize">{role.name}</div>
                        {role.is_system_role && (
                          <div className="text-xs opacity-75 mt-1">
                            Sistema
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Detalles del rol */}
              <div className="lg:col-span-2">
                {selectedRole ? (
                  <div className="bg-white border border-gray-200 rounded-lg p-8">
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 capitalize mb-2">
                        {selectedRole.name}
                      </h2>
                      {selectedRole.description && (
                        <p className="text-gray-600">
                          {selectedRole.description}
                        </p>
                      )}
                      {selectedRole.is_system_role && (
                        <span className="inline-block mt-4 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                          Rol del sistema
                        </span>
                      )}
                    </div>

                    {/* Usuarios con este rol */}
                    <div className="border-t border-gray-200 pt-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Usuarios asignados: {roleAssignments.length}
                      </h3>

                      {roleAssignments.length > 0 ? (
                        <div className="space-y-3">
                          {roleAssignments.map((assignment) => (
                            <div
                              key={assignment.id}
                              className="border border-gray-200 rounded-lg p-4"
                            >
                              <p className="font-medium text-gray-900">
                                {assignment.user_profiles
                                  ?.display_name ||
                                  assignment.user_profiles
                                    ?.first_name ||
                                  assignment.users?.email ||
                                  'Usuario sin nombre'}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {assignment.users?.email}
                              </p>
                              {assignment.scope_id && (
                                <p className="text-xs text-gray-500 mt-2">
                                  Ámbito: {assignment.scope_id}
                                </p>
                              )}
                              <p className="text-xs text-gray-400 mt-2">
                                Asignado:{' '}
                                {new Date(
                                  assignment.assigned_at
                                ).toLocaleDateString('es-ES')}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">
                          No hay usuarios asignados a este rol
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <p className="text-gray-600">
                      Selecciona un rol para ver detalles
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
