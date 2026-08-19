'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message || 'Error al iniciar sesión');
        setLoading(false);
        return;
      }

      router.push('/dashboard');
    } catch (err) {
      setError('Error inesperado');
      setLoading(false);
    }
  };

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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Bienvenido
            </h1>
            <p className="text-gray-600 mb-8">
              Inicia sesión en tu cuenta de Academia
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                <AlertCircle className="text-red-600 mt-0.5" size={20} />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="label-field">
                  <Mail className="inline mr-2" size={16} />
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="input-field"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="label-field">
                  <Lock className="inline mr-2" size={16} />
                  Contraseña
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

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                ¿No tienes cuenta?{' '}
                <Link
                  href="/register"
                  className="text-institutional-dark font-medium hover:underline"
                >
                  Regístrate aquí
                </Link>
              </p>
              <p className="text-sm text-gray-600 mt-2">
                ¿Olvidaste tu contraseña?{' '}
                <Link
                  href="/forgot-password"
                  className="text-institutional-dark font-medium hover:underline"
                >
                  Recupérala aquí
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
