'use client';

import { createClient } from '@/lib/supabase/client';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Loading } from '@/components/Loading';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Scope } from '@/types';
import { EmptyState } from '@/components/EmptyState';
import { Database } from 'lucide-react';

export default function AdminScopesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [scopes, setScopes] = useState<Scope[]>([]);

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

      // Obtener scopes
      const { data: scopesData } = await supabase
        .from('scopes')
        .select('*')
        .order('created_at', { ascending: false });

      if (scopesData) {
        setScopes(scopesData);
      }

      setLoading(false);
    };

    checkAuth();
  }, [router]);

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
              Gestión de Scopes (Ámbitos)
            </h1>
            <p className="text-gray-600 mb-8">
              Total de scopes: {scopes.length}
            </p>

            {scopes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {scopes.map((scope) => (
                  <div
                    key={scope.id}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <Database size={24} className="text-institutional-dark" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {scope.code}
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">
                          Tipo
                        </p>
                        <p className="text-sm text-gray-700 capitalize">
                          {scope.scope_type}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">
                          ID
                        </p>
                        <p className="text-xs text-gray-600 font-mono break-all">
                          {scope.id}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">
                          Creado
                        </p>
                        <p className="text-xs text-gray-600">
                          {new Date(scope.created_at).toLocaleDateString(
                            'es-ES'
                          )}
                        </p>
                      </div>
                      {scope.metadata && (
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase">
                            Metadata
                          </p>
                          <pre className="text-xs bg-gray-50 p-2 rounded mt-1 overflow-auto">
                            {JSON.stringify(scope.metadata, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Database size={48} />}
                title="No hay scopes configurados"
                description="Los scopes se crearán cuando se configuren grupos, proyectos o ámbitos específicos."
              />
            )}

            {/* Info */}
            <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-2">
                ¿Qué son los Scopes?
              </h3>
              <p className="text-sm text-blue-800">
                Los scopes (ámbitos) son contextos de autorización que permiten
                asignar roles a un usuario dentro de un ámbito específico
                (grupo, proyecto, departamento, etc.). Actualmente son
                infraestructura contextual que se configurará cuando se
                implementen entidades académicas reales.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
