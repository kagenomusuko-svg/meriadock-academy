'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Lock, AlertCircle, CheckCircle } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validLink, setValidLink] = useState(true);

  useEffect(() => {
    const checkLink = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setValidLink(false);
      }
    };

    checkLink();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validaciones
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();

      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        setError(updateError.message || 'Error al cambiar la contraseña');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      setError('Error inesperado');
      setLoading(false);
    }
  };

  if (!validLink) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-institutional-dark to-gray-50">
        {/* Header */}
        <header className="bg-institutional-dark text-institutional-light py-6">
          <div className="max-w-md mx-auto px-4">
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
          <div className="w-full max-w-md">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <AlertCircle size={64} className="mx-auto mb-6 text-red-600" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Enlace inválido
              </h1>
              <p className="text-gray-600 mb-6">
                Este enlace de recuperación es inválido o ha expirado.
              </p>
              <Link href="/forgot-password" className="btn-primary inline-block">
                Solicitar nuevo enlace
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-institutional-dark to-gray-50">
      {/* Header */}
      <header className="bg-institutional-dark text-institutional-light py-6">
        <div className="max-w-md mx-auto px-4">
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
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {success ? (
              <>
                <div className="flex justify-center mb-6">
                  <CheckCircle size={64} className="text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
                  Contraseña actualizada
                </h1>
                <p className="text-gray-600 text-center mb-6">
                  Tu contraseña ha sido restablecida correctamente. Serás
                  redirigido a la página de inicio de sesión en unos segundos.
                </p>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Restablecer contraseña
                </h1>
                <p className="text-gray-600 mb-8">
                  Ingresa tu nueva contraseña
                </p>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                    <AlertCircle className="text-red-600 mt-0.5" size={20} />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="label-field">
                      <Lock className="inline mr-2" size={16} />
                      Nueva contraseña
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="input-field"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="label-field">
                      <Lock className="inline mr-2" size={16} />
                      Confirmar contraseña
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="input-field"
                      required
                      disabled={loading}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full"
                  >
                    {loading ? 'Actualizando...' : 'Restablecer contraseña'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
