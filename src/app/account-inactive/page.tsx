'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { LogOut, XCircle } from 'lucide-react';

export default function AccountInactivePage() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-institutional-dark text-institutional-light py-6 border-b-4 border-gray-400">
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
          <XCircle size={64} className="mx-auto mb-6 text-gray-600" />

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Cuenta inactiva
          </h1>

          <p className="text-gray-600 mb-6">
            Tu cuenta ha sido marcada como inactiva. Si deseas reactivarla,
            por favor contacta al administrador.
          </p>

          <div className="bg-white rounded-lg p-6 mb-8 border border-gray-200">
            <p className="text-sm text-gray-600 mb-4">
              <strong>Estado de tu cuenta</strong>
              <br />
              Actualmente no tienes acceso a Academia. Tu perfil está disponible
              pero requiere reactivación administrativa.
            </p>
            <p className="text-sm text-gray-600">
              <strong>Cómo reactivar</strong>
              <br />
              Envía un correo a{' '}
              <code className="bg-gray-100 px-2 py-1 rounded">
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
