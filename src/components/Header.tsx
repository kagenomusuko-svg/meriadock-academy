'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X, LogOut } from 'lucide-react';

interface HeaderProps {
  userName?: string;
}

export function Header({ userName }: HeaderProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const supabase = createClient();
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <header className="bg-institutional-dark text-institutional-light sticky top-0 z-50 border-b border-institutional-light/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="text-xl font-semibold">🎓</div>
            <div>
              <div className="text-sm font-semibold">Academia Meriadock</div>
              <div className="text-xs opacity-75">Formación y Asesoría</div>
            </div>
          </div>

          {/* Navegación Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="/dashboard" className="text-sm hover:opacity-80 transition">
              Dashboard
            </a>
            <a href="/profile" className="text-sm hover:opacity-80 transition">
              Perfil
            </a>
          </nav>

          {/* Usuario y Logout */}
          <div className="hidden md:flex items-center gap-4">
            {user && (
              <span className="text-sm opacity-75">{user.email}</span>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm hover:opacity-80 transition"
            >
              <LogOut size={16} />
              Salir
            </button>
          </div>

          {/* Menú Mobile */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Menú Mobile Expandido */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-institutional-light/10">
            <nav className="flex flex-col gap-2 pt-4">
              <a
                href="/dashboard"
                className="text-sm hover:opacity-80 transition py-2"
              >
                Dashboard
              </a>
              <a
                href="/profile"
                className="text-sm hover:opacity-80 transition py-2"
              >
                Perfil
              </a>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm hover:opacity-80 transition py-2"
              >
                <LogOut size={16} />
                Salir
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
