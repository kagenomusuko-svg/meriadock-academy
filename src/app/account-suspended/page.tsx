'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AlertTriangle, LogOut } from 'lucide-react';

export default function AccountSuspendedPage() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-red-50">
      {/* Header */}
      <header className="bg-institutional-dark text-institutional-light py-6 border-b-4 border-red-500">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-2">
            <div className="text-2xl">🎓</div>
            <div>
              <div className="text-lg font-semibold">Academia Meriadock</div>
              <div className="text-sm opacity-75">Formación y Asesoría</div>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md text-center">
          <AlertTriangle size={64} className="mx-auto mb-6 text-red-600" />

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Cuenta suspendida
          </h1>

          <p className="text-gray-600 mb-6">
            Tu cuenta ha sido suspendida. Si crees que esto es un error, por favor
            contacta al administrador del sistema.
          </p>

          <div className="bg-white rounded-lg p-6 mb-8 border border-red-200">
            <p className="text-sm text-gray-600 mb-4">
              <strong>¿Qué pasó?</strong>
              <br />
              Tu acceso a Academia ha sido limitado temporalmente por razones de
              seguridad o administrativas.
            </p>
            <p className="text-sm text-gray-600">
              <strong>Próximos pasos</strong>
              <br />
              Contacta a <code className="bg-gray-100 px-2 py-1 rounded">
                admin@meriadock.org.mx
              </code>
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 btn-primary"
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
