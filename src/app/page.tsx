'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Users, Beaker, ArrowRight } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        router.push('/dashboard');
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-institutional-dark text-institutional-light sticky top-0 z-50 border-b border-institutional-light/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="text-2xl">🎓</div>
              <div>
                <div className="font-semibold">Academia Meriadock</div>
                <div className="text-xs opacity-75">Formación y Asesoría</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm hover:opacity-80 transition"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/register"
                className="text-sm px-4 py-2 bg-institutional-light text-institutional-dark rounded-lg font-medium hover:opacity-90 transition"
              >
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-institutional-dark to-gray-50 text-white py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6">
            Academia Meriadock
          </h1>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Una plataforma integral de formación, investigación y desarrollo
            tecnológico. Conecta, aprende y crece con nosotros.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-institutional-dark font-semibold rounded-lg hover:shadow-lg transition"
            >
              Crear cuenta gratis
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition"
            >
              Tengo cuenta
            </Link>
          </div>
        </div>
      </section>

      {/* Características */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-900">
            Pilares de Academia Meriadock
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Formación */}
            <div className="bg-gradient-to-b from-blue-50 to-white border border-blue-200 rounded-lg p-8">
              <BookOpen size={40} className="text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Formación
              </h3>
              <p className="text-gray-600">
                Programas educativos estructurados, cursos especializados y
                espacios de aprendizaje colaborativo diseñados para potenciar
                tus capacidades.
              </p>
            </div>

            {/* Investigación */}
            <div className="bg-gradient-to-b from-green-50 to-white border border-green-200 rounded-lg p-8">
              <Beaker size={40} className="text-green-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Investigación y Desarrollo
              </h3>
              <p className="text-gray-600">
                Generamos conocimiento y desarrollamos herramientas que
                amplíen nuestra capacidad para comprender y resolver problemas
                complejos.
              </p>
            </div>

            {/* Comunidad */}
            <div className="bg-gradient-to-b from-purple-50 to-white border border-purple-200 rounded-lg p-8">
              <Users size={40} className="text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Trabajo Comunitario
              </h3>
              <p className="text-gray-600">
                Diseñamos e implementamos iniciativas que generan condiciones
                materiales de posibilidad para personas y comunidades.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-institutional-dark text-institutional-light py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            ¿Listo para transformar tu experiencia de aprendizaje?
          </h2>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-3 bg-institutional-light text-institutional-dark font-semibold rounded-lg hover:shadow-lg transition"
          >
            Crea tu cuenta hoy
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Academia</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/login" className="hover:text-institutional-dark">
                    Iniciar sesión
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="hover:text-institutional-dark"
                  >
                    Registrarse
                  </Link>
                </li>
                <li>
                  <Link
                    href="/forgot-password"
                    className="hover:text-institutional-dark"
                  >
                    Recuperar contraseña
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">
                Centro Meriadock
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="https://meriadock.org.mx" className="hover:text-institutional-dark">
                    Sitio principal
                  </a>
                </li>
                <li>
                  <a href="mailto:contacto@meriadock.org.mx" className="hover:text-institutional-dark">
                    Contacto
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#privacy" className="hover:text-institutional-dark">
                    Privacidad
                  </a>
                </li>
                <li>
                  <a href="#terms" className="hover:text-institutional-dark">
                    Términos
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
            <p>
              © {new Date().getFullYear()} Centro Multidisciplinario Meriadock. Formación y Asesoría A.C.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
