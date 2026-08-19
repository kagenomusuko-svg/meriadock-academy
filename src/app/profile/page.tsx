'use client';

import { createClient } from '@/lib/supabase/client';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Loading } from '@/components/Loading';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UserProfile } from '@/types';
import { User, Mail, Phone, Briefcase } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  // Formulario
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [position, setPosition] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      setUser(user);

      // Obtener perfil
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
        setFirstName(profileData.first_name || '');
        setLastName(profileData.last_name || '');
        setDisplayName(profileData.display_name || '');
        setPhone(profileData.phone || '');
        setPosition(profileData.official_position || '');
      }

      // Verificar si es admin
      const { data: roles } = await supabase.rpc('get_my_roles');
      setIsAdmin(roles?.some((r: any) => r.role_name === 'system_admin'));

      setLoading(false);
    };

    fetchData();
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from('user_profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          display_name: displayName,
          phone,
          official_position: position,
        })
        .eq('user_id', user.id);

      if (error) {
        setMessage('Error al guardar: ' + error.message);
      } else {
        setMessage('Perfil actualizado correctamente');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setMessage('Error inesperado');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex">
        <Sidebar isAdmin={isAdmin} />
        <main className="flex-1">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Perfil</h1>
            <p className="text-gray-600 mb-8">
              Administra tu información personal y de cuenta
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Información de cuenta */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Información de cuenta
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">
                        Correo electrónico
                      </p>
                      <p className="text-sm text-gray-900 mt-1 break-all">
                        {user.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">
                        ID de usuario
                      </p>
                      <p className="text-xs text-gray-600 mt-1 font-mono break-all">
                        {user.id}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">
                        Cuenta creada
                      </p>
                      <p className="text-sm text-gray-900 mt-1">
                        {new Date(user.created_at).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Formulario de edición */}
              <div className="lg:col-span-2">
                <div className="bg-white border border-gray-200 rounded-lg p-8">
                  {message && (
                    <div
                      className={`mb-6 p-4 rounded-lg ${
                        message.includes('Error')
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-green-50 text-green-700 border border-green-200'
                      }`}
                    >
                      {message}
                    </div>
                  )}

                  <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="label-field">
                          <User className="inline mr-2" size={16} />
                          Nombre
                        </label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="input-field"
                          disabled={saving}
                        />
                      </div>
                      <div>
                        <label className="label-field">Apellido</label>
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="input-field"
                          disabled={saving}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="label-field">
                        Nombre mostrado
                      </label>
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Cómo quieres aparecer en Academia"
                        className="input-field"
                        disabled={saving}
                      />
                    </div>

                    <div>
                      <label className="label-field">
                        <Phone className="inline mr-2" size={16} />
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="input-field"
                        disabled={saving}
                      />
                    </div>

                    <div>
                      <label className="label-field">
                        <Briefcase className="inline mr-2" size={16} />
                        Puesto o cargo
                      </label>
                      <input
                        type="text"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        className="input-field"
                        disabled={saving}
                      />
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                      <button
                        type="submit"
                        disabled={saving}
                        className="btn-primary"
                      >
                        {saving ? 'Guardando...' : 'Guardar cambios'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
