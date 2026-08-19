'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, AlertCircle, User } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
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

      // Registrar usuario
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (signUpError) {
        setError(
          signUpError.message || 'Error al registrarse'
        );
        setLoading(false);
        return;
      }

      // Actualizar perfil
      if (data.user) {
        await supabase
          .from('user_profiles')
          .update({
            first_name: firstName,
            last_name: lastName,
          })
          .eq('user_id', data.user.id);
      }

      // Redirigir a login
      router.push('/login?registered=true');
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
              Crear cuenta
            </h1>
            <p className="text-gray-600 mb-8">
              Únete a Academia Meriadock
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                <AlertCircle className="text-red-600 mt-0.5" size={20} />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-field">Nombre</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Juan"
                    className="input-field"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="label-field">Apellido</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Pérez"
                    className="input-field"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

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
                {loading ? 'Registrando...' : 'Crear cuenta'}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                ¿Ya tienes cuenta?{' '}
                <Link
                  href="/login"
                  className="text-institutional-dark font-medium hover:underline"
                >
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
