'use client';

import { createClient } from '@/lib/supabase/client';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Loading } from '@/components/Loading';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { UserRole, UserStatus, UserProfile } from '@/types';
import { getMyRoles, getMyAccountStatus } from '@/lib/authorization';
import {
  Calendar,
  Users,
  BookOpen,
  Beaker,
  Users2,
  Shield,
  Lock,
  Database,
  FileText,
} from 'lucide-react';

const modules = [
  {
    id: 'formacion',
    title: 'Formación',
    description: 'Cursos, capacitaciones y programas educativos',
    icon: BookOpen,
    available: false,
  },
  {
    id: 'docencia',
    title: 'Docencia',
    description: 'Gestión de clases y material didáctico',
    icon: Users,
    available: false,
  },
  {
    id: 'tutoria',
    title: 'Tutoría',
    description: 'Acompañamiento y tutoría de estudiantes',
    icon: Users2,
    available: false,
  },
  {
    id: 'investigacion',
    title: 'Investigación',
    description: 'Proyectos de investigación y desarrollo',
    icon: Beaker,
    available: false,
  },
  {
    id: 'coordinacion',
    title: 'Coordinación',
    description: 'Funciones coordinacionales',
    icon: Shield,
    available: false,
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [status, setStatus] = useState<UserStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

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

      setUser(user);

      // Obtener status
      const accountStatus = await getMyAccountStatus();
      if (accountStatus) {
        setStatus(accountStatus.status as UserStatus);

        // Si la cuenta no está activa, redirigir
        if (accountStatus.status === 'suspended') {
          router.push('/account-suspended');
          return;
        }
        if (accountStatus.status === 'inactive') {
          router.push('/account-inactive');
          return;
        }
      }

      // Obtener perfil
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      // Obtener roles
      const userRoles = await getMyRoles();
      setRoles(userRoles);
      setIsAdmin(userRoles.some((r) => r.role_name === 'system_admin'));

      setLoading(false);
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return null;
  }

  const displayName = profile?.display_name ||
    profile?.first_name ||
    user.email ||
    'Usuario';

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex">
        <Sidebar isAdmin={isAdmin} />
        <main className="flex-1">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Bienvenida */}
            <div className="mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Bienvenido, {displayName}
              </h1>
              <p className="text-gray-600">
                {user.email}
              </p>
            </div>

            {/* Tarjeta de estado */}
            <div className="bg-gradient-to-r from-institutional-dark to-institutional-dark/80 rounded-lg p-6 text-institutional-light mb-12">
              <div className="grid grid-cols-3 gap-8">
                <div>
                  <div className="text-3xl font-bold">
                    {roles.length}
                  </div>
                  <div className="text-sm opacity-75 mt-1">
                    Rol{roles.length !== 1 ? 'es' : ''} activo{roles.length !== 1 ? 's' : ''}
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold">
                    {roles.filter((r) => r.scope_id).length}
                  </div>
                  <div className="text-sm opacity-75 mt-1">
                    Ámbito{roles.filter((r) => r.scope_id).length !== 1 ? 's' : ''}
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold capitalize">
                    {status}
                  </div>
                  <div className="text-sm opacity-75 mt-1">
                    Estado de cuenta
                  </div>
                </div>
              </div>
            </div>

            {/* Roles actuales */}
            {roles.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Tus roles y espacios
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {roles.map((role, idx) => (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-lg p-4 hover:border-institutional-dark transition"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 capitalize">
                            {role.role_name}
                          </h3>
                          {role.scope_code && (
                            <p className="text-sm text-gray-500 mt-1">
                              Ámbito: {role.scope_code}
                            </p>
                          )}
                        </div>
                        <div className="w-3 h-3 rounded-full bg-green-500 mt-1"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Panel administrativo o Módulos académicos */}
            {isAdmin ? (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Panel de Administración
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Link
                    href="/admin/users"
                    className="border border-gray-200 rounded-lg p-6 hover:border-institutional-dark hover:shadow-lg transition"
                  >
                    <Users
                      size={32}
                      className="mb-4 text-institutional-dark"
                    />
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Usuarios
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Gestiona usuarios, roles y permisos
                    </p>
                    <span className="text-sm font-medium text-institutional-dark hover:underline">
                      Acceder →
                    </span>
                  </Link>

                  <Link
                    href="/admin/audit"
                    className="border border-gray-200 rounded-lg p-6 hover:border-institutional-dark hover:shadow-lg transition"
                  >
                    <FileText
                      size={32}
                      className="mb-4 text-institutional-dark"
                    />
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Auditoría
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Consulta los registros de auditoría del sistema
                    </p>
                    <span className="text-sm font-medium text-institutional-dark hover:underline">
                      Acceder →
                    </span>
                  </Link>

                  <Link
                    href="/admin/roles"
                    className="border border-gray-200 rounded-lg p-6 hover:border-institutional-dark hover:shadow-lg transition"
                  >
                    <Lock
                      size={32}
                      className="mb-4 text-institutional-dark"
                    />
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Roles
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Visualiza roles y sus asignaciones
                    </p>
                    <span className="text-sm font-medium text-institutional-dark hover:underline">
                      Acceder →
                    </span>
                  </Link>

                  <Link
                    href="/admin/scopes"
                    className="border border-gray-200 rounded-lg p-6 hover:border-institutional-dark hover:shadow-lg transition"
                  >
                    <Database
                      size={32}
                      className="mb-4 text-institutional-dark"
                    />
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Ámbitos
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Consulta los ámbitos del sistema
                    </p>
                    <span className="text-sm font-medium text-institutional-dark hover:underline">
                      Acceder →
                    </span>
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                {(() => {
                  // Calcular módulos disponibles basándose en roles reales
                  const availableModules = modules.filter((module) => {
                    const hasRole = roles.some((r) => {
                      if (module.id === 'formacion')
                        return r.role_name === 'estudiante';
                      if (module.id === 'docencia')
                        return r.role_name === 'docente';
                      if (module.id === 'tutoria')
                        return r.role_name === 'tutor';
                      if (module.id === 'investigacion')
                        return r.role_name === 'investigador';
                      if (module.id === 'coordinacion')
                        return r.role_name === 'coordinador';
                      return false;
                    });
                    return hasRole && module.available;
                  });

                  // Si no tiene roles académicos, mostrar estado vacío
                  if (availableModules.length === 0) {
                    return (
                      <div className="text-center py-12">
                        <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                          Sin áreas asignadas
                        </h2>
                        <p className="text-gray-600">
                          No tienes acceso a ningún área académica en este momento.
                          Contacta con administración si crees que es un error.
                        </p>
                      </div>
                    );
                  }

                  // Mostrar solo los módulos disponibles
                  return (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Mi Academia
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {availableModules.map((module) => {
                          const Icon = module.icon;
                          return (
                            <div
                              key={module.id}
                              className="border-2 border-institutional-dark bg-institutional-dark/5 rounded-lg p-6 cursor-pointer hover:shadow-lg transition"
                            >
                              <Icon
                                size={32}
                                className="mb-4 text-institutional-dark"
                              />
                              <h3 className="font-semibold text-gray-900 mb-2">
                                {module.title}
                              </h3>
                              <p className="text-sm text-gray-600 mb-4">
                                {module.description}
                              </p>
                              <button className="text-sm font-medium text-institutional-dark hover:underline">
                                Acceder →
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
