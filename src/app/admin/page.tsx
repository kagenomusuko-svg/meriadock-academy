'use client';

import { createClient } from '@/lib/supabase/client';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Loading } from '@/components/Loading';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Users, Lock, Database, FileText } from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  totalRoles: number;
  totalScopes: number;
  recentAudits: number;
}

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    suspendedUsers: 0,
    totalRoles: 0,
    totalScopes: 0,
    recentAudits: 0,
  });

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
        p_permission_name: 'users.view_all',
      });

      if (!hasPermission?.data) {
        router.push('/dashboard');
        return;
      }

      // Obtener estadísticas
      try {
        // Usuarios
        const { count: totalUsers } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });

        const { count: activeUsers } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active');

        const { count: suspendedUsers } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'suspended');

        // Roles
        const { count: totalRoles } = await supabase
          .from('roles')
          .select('*', { count: 'exact', head: true });

        // Scopes
        const { count: totalScopes } = await supabase
          .from('scopes')
          .select('*', { count: 'exact', head: true });

        // Auditoría reciente (últimas 24 horas)
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const { count: recentAudits } = await supabase
          .from('audit_logs')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', yesterday.toISOString());

        setStats({
          totalUsers: totalUsers || 0,
          activeUsers: activeUsers || 0,
          suspendedUsers: suspendedUsers || 0,
          totalRoles: totalRoles || 0,
          totalScopes: totalScopes || 0,
          recentAudits: recentAudits || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }

      setLoading(false);
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return <Loading />;
  }

  const statCards = [
    {
      label: 'Usuarios totales',
      value: stats.totalUsers,
      icon: Users,
      href: '/admin/users',
    },
    {
      label: 'Usuarios activos',
      value: stats.activeUsers,
      icon: Users,
      href: '/admin/users',
      color: 'text-green-600',
    },
    {
      label: 'Usuarios suspendidos',
      value: stats.suspendedUsers,
      icon: Users,
      href: '/admin/users',
      color: 'text-red-600',
    },
    {
      label: 'Roles definidos',
      value: stats.totalRoles,
      icon: Lock,
      href: '/admin/roles',
    },
    {
      label: 'Scopes',
      value: stats.totalScopes,
      icon: Database,
      href: '/admin/scopes',
    },
    {
      label: 'Auditorías (24h)',
      value: stats.recentAudits,
      icon: FileText,
      href: '/admin/audit',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex">
        <Sidebar isAdmin={true} />
        <main className="flex-1">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Panel de Administración
            </h1>
            <p className="text-gray-600 mb-8">
              Gestión técnica del sistema
            </p>

            {/* Tarjetas de estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {statCards.map((card) => {
                const Icon = card.icon;
                return (
                  <a
                    key={card.href}
                    href={card.href}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:border-institutional-dark hover:shadow-lg transition"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <Icon
                        size={24}
                        className={card.color || 'text-institutional-dark'}
                      />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {card.value}
                    </div>
                    <p className="text-sm text-gray-600">{card.label}</p>
                  </a>
                );
              })}
            </div>

            {/* Información */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-2">
                Infraestructura del sistema
              </h3>
              <p className="text-sm text-blue-800 mb-4">
                Este panel proporciona acceso a las funciones técnicas de
                administración de Academia Meriadock. Utiliza los enlaces de
                navegación para:
              </p>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>Gestionar usuarios y sus estados</li>
                <li>Administrar asignaciones de roles</li>
                <li>Configurar ámbitos de autorización</li>
                <li>Consultar registros de auditoría</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
