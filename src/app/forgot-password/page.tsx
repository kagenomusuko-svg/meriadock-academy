'use client';

import { createClient } from '@/lib/supabase/client';
import { useState } from 'react';
import Link from 'next/link';
import { Mail, AlertCircle, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      if (resetError) {
        setError(resetError.message || 'Error al enviar el correo');
        setLoading(false);
        return;
      }

      setSent(true);
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
            {sent ? (
              <>
                <div className="flex justify-center mb-6">
                  <CheckCircle size={64} className="text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
                  Correo enviado
                </h1>
                <p className="text-gray-600 text-center mb-6">
                  Hemos enviado un enlace de recuperación a{' '}
                  <strong>{email}</strong>. Revisa tu correo e ingresa al enlace
                  para restablecer tu contraseña.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800 mb-6">
                  Si no ves el correo, revisa tu carpeta de spam o solicita
                  otro enlace en unos minutos.
                </div>
                <Link href="/login" className="btn-primary w-full block text-center">
                  Volver a iniciar sesión
                </Link>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Recuperar contraseña
                </h1>
                <p className="text-gray-600 mb-8">
                  Ingresa tu correo electrónico y te enviaremos un enlace para
                  restablecer tu contraseña.
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

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full"
                  >
                    {loading
                      ? 'Enviando...'
                      : 'Enviar enlace de recuperación'}
                  </button>
                </form>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600 text-center">
                    ¿Recordaste tu contraseña?{' '}
                    <Link
                      href="/login"
                      className="text-institutional-dark font-medium hover:underline"
                    >
                      Inicia sesión aquí
                    </Link>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
