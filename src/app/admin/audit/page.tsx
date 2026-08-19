'use client';

import { createClient } from '@/lib/supabase/client';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Loading } from '@/components/Loading';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AuditLog } from '@/types';
import { EmptyState } from '@/components/EmptyState';
import { FileText } from 'lucide-react';

export default function AdminAuditPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<any[]>([]);
  const [canViewAll, setCanViewAll] = useState(false);

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
      const { data: canView } = await supabase.rpc('can_do', {
        p_permission_name: 'audit.view_all',
      });

      setCanViewAll(canView ?? false);

      // Obtener logs
      let query = supabase.from('audit_logs').select(
        `
        *
      `
      );

      // Si no puede ver todos, solo su propia auditoría
      if (!canView) {
        query = query.eq('actor_id', user.id);
      }

      const { data: logsData } = await query
        .order('created_at', { ascending: false })
        .limit(100);

      if (logsData) {
        setLogs(logsData);
      }

      setLoading(false);
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return <Loading />;
  }

  const actionColors: Record<string, string> = {
    assign_role: 'bg-green-100 text-green-800',
    revoke_role: 'bg-red-100 text-red-800',
    update_user_status: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex">
        <Sidebar isAdmin={true} />
        <main className="flex-1">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Auditoría {canViewAll ? 'Global' : 'Personal'}
            </h1>
            <p className="text-gray-600 mb-8">
              Registro de operaciones críticas: {logs.length}
            </p>

            {logs.length > 0 ? (
              <div className="space-y-4">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span
                            className={`inline-block px-3 py-1 rounded text-xs font-semibold ${
                              actionColors[log.action] ||
                              'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {log.action}
                          </span>
                          <span className="text-xs text-gray-500 capitalize">
                            {log.resource_type}
                          </span>
                        </div>
                        <p className="font-medium text-gray-900">
                          {log.resource_name}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 text-right whitespace-nowrap ml-4">
                        {new Date(log.created_at).toLocaleString('es-ES')}
                      </p>
                    </div>

                    {/* Detalles */}
                    <div className="text-xs text-gray-600 space-y-2">
                      {log.old_values && (
                        <div>
                          <span className="font-medium">Valores anteriores:</span>
                          <pre className="bg-gray-50 p-2 rounded mt-1 overflow-auto">
                            {JSON.stringify(log.old_values, null, 2)}
                          </pre>
                        </div>
                      )}
                      {log.new_values && (
                        <div>
                          <span className="font-medium">Valores nuevos:</span>
                          <pre className="bg-gray-50 p-2 rounded mt-1 overflow-auto">
                            {JSON.stringify(log.new_values, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<FileText size={48} />}
                title="Sin registros de auditoría"
                description="Aún no hay operaciones registradas"
              />
            )}

            {/* Info */}
            <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-2">
                Sobre el registro de auditoría
              </h3>
              <p className="text-sm text-blue-800">
                La auditoría registra todas las operaciones críticas del
                sistema: asignación y revocación de roles, cambios de estado de
                usuario, y modificaciones administrativas. {!canViewAll && (
                  <>
                    <br />
                    Actualmente ves solo tu propia auditoría. Los administradores pueden ver el
                    registro global.
                  </>
                )}
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
