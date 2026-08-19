'use client';

import { createClient } from '@/lib/supabase/client';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Loading } from '@/components/Loading';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UserRole, UserStatus, UserProfile } from '@/types';
import { getMyRoles, getMyAccountStatus } from '@/lib/authorization';
import { Calendar, Users, BookOpen, Beaker, Users2, Shield } from 'lucide-react';

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

            {/* Módulos */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Mi Academia
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {modules.map((module) => {
                  const Icon = module.icon;
                  const userHasRole = roles.some((r) => {
                    // Mapear roles a módulos
                    if (module.id === 'formacion') return r.role_name === 'estudiante';
                    if (module.id === 'docencia')
                      return r.role_name === 'docente';
                    if (module.id === 'tutoria') return r.role_name === 'tutor';
                    if (module.id === 'investigacion')
                      return r.role_name === 'investigador';
                    if (module.id === 'coordinacion')
                      return r.role_name === 'coordinador';
                    return false;
                  });

                  return (
                    <div
                      key={module.id}
                      className={`rounded-lg border-2 p-6 transition ${
                        module.available
                          ? userHasRole
                            ? 'border-institutional-dark bg-institutional-dark/5 cursor-pointer hover:shadow-lg'
                            : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <Icon
                        size={32}
                        className={`mb-4 ${
                          module.available && userHasRole
                            ? 'text-institutional-dark'
                            : 'text-gray-400'
                        }`}
                      />
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {module.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {module.description}
                      </p>
                      {module.available ? (
                        userHasRole ? (
                          <button className="text-sm font-medium text-institutional-dark hover:underline">
                            Acceder →
                          </button>
                        ) : (
                          <p className="text-xs text-gray-500">
                            No tienes acceso a este módulo
                          </p>
                        )
                      ) : (
                        <p className="text-xs text-gray-500 bg-yellow-50 px-2 py-1 rounded inline-block">
                          Módulo en construcción
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
