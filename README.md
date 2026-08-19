# Academia Meriadock

Plataforma de formación, investigación y trabajo comunitario.

## Stack Tecnológico

- **Frontend**: Next.js 14 + TypeScript + React 18
- **Estilos**: Tailwind CSS
- **Autenticación**: Supabase Auth
- **Base de datos**: Supabase PostgreSQL
- **SDK Supabase**: @supabase/ssr (SSR-optimizado)
- **Iconos**: Lucide React

## Requisitos

- Node.js 18+
- npm o yarn

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/kagenomusuko-svg/meriadock-academy.git
cd meriadock-academy
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo `.env.example` a `.env.local` y completa con tus credenciales:

```bash
cp .env.example .env.local
```

Edita `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=tu-clave-publishable
NEXT_PUBLIC_SITE_URL=http://localhost:3000/academia
```

**Variables de entorno:**
- `NEXT_PUBLIC_SUPABASE_URL`: URL del proyecto Supabase
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: Clave pública (anon/publishable) de Supabase
- `NEXT_PUBLIC_SITE_URL`: URL pública de Academia
  - **Desarrollo**: `http://localhost:3000/academia`
  - **Producción**: `https://www.meriadock.org.mx/academia`

### 4. Ejecutar el servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000/academia](http://localhost:3000/academia) en tu navegador.

**Nota**: Academia se ejecuta bajo el prefijo `/academia` (basePath) tanto en desarrollo como en producción.

## Integración con meriadock-site

Academia Meriadock está integrada en el sitio principal a través de path routing:

- **URL pública**: `https://www.meriadock.org.mx/academia`
- **Rutas internas**: Se sirven bajo `/academia/login`, `/academia/dashboard`, etc.
- **basePath**: Configurado a `/academia` en `next.config.js`
- **Repositorio independiente**: Mantenido como proyecto separado en Vercel

### Redirecciones de Supabase Auth

Las redirecciones de autenticación se calculan dinámicamente usando `NEXT_PUBLIC_SITE_URL`:

```typescript
// En desarrollo: http://localhost:3000/academia/reset-password
// En producción: https://www.meriadock.org.mx/academia/reset-password
const redirectTo = `${NEXT_PUBLIC_SITE_URL}/reset-password`;
```

Para cambiar las Redirect URLs en Supabase, ve a:
**Authentication → URL Configuration** y agrega/actualiza:
- `http://localhost:3000/academia` (desarrollo)
- `https://www.meriadock.org.mx/academia` (producción)

## Flujo de Autenticación

### 1. Configurar Supabase Auth

- Ve a tu proyecto en Supabase
- Dirígete a Authentication → Providers
- Activa "Email" (si no está activo)
- Configura las URLs de redirección en Authentication → URL Configuration

### 2. Crear primer usuario administrador

1. Registra una cuenta desde la aplicación (`/register`)
2. Obtén el UUID de tu usuario desde `auth.users` en Supabase SQL
3. Ejecuta esta consulta en Supabase SQL Editor:

```sql
INSERT INTO public.role_assignments (
    user_id,
    role_id,
    scope_id,
    assigned_by
)
SELECT
    'TU_UUID_AQUÍ'::UUID,
    r.id,
    NULL,
    'TU_UUID_AQUÍ'::UUID
FROM public.roles r
WHERE r.name = 'system_admin';
```

Reemplaza `TU_UUID_AQUÍ` con el UUID real de tu usuario.

## Estructura del Proyecto

```
src/
├── app/
│   ├── login/                 # Página de inicio de sesión
│   ├── register/              # Página de registro
│   ├── dashboard/             # Dashboard principal
│   ├── profile/               # Perfil de usuario
│   ├── admin/                 # Panel de administración
│   │   ├── users/            # Gestión de usuarios
│   │   ├── roles/            # Gestión de roles
│   │   ├── scopes/           # Gestión de ámbitos
│   │   └── audit/            # Auditoría
│   ├── forgot-password/       # Recuperación de contraseña
│   ├── reset-password/        # Resetear contraseña
│   ├── account-suspended/     # Cuenta suspendida
│   ├── account-inactive/      # Cuenta inactiva
│   ├── globals.css            # Estilos globales
│   └── layout.tsx             # Layout raíz
├── components/
│   ├── Header.tsx             # Encabezado
│   ├── Sidebar.tsx            # Barra lateral
│   ├── Loading.tsx            # Componente de carga
│   ├── EmptyState.tsx         # Estado vacío
│   └── ErrorAlert.tsx         # Alerta de error
├── lib/
│   ├── supabase/
│   │   ├── client.ts          # Cliente para navegador
│   │   └── server.ts          # Cliente para servidor
│   └── authorization.ts       # Funciones de autorización
├── types/
│   └── index.ts               # Tipos TypeScript
└── ...
```

## Funcionalidades

### Autenticación
- ✅ Registro de nuevos usuarios
- ✅ Inicio de sesión
- ✅ Recuperación de contraseña
- ✅ Reset de contraseña
- ✅ Sesiones persistentes

### Dashboard
- ✅ Bienvenida personalizada
- ✅ Visualización de roles y ámbitos
- ✅ Acceso a módulos futuros
- ✅ Estado de cuenta

### Perfil
- ✅ Ver información personal
- ✅ Editar perfil
- ✅ Información de cuenta

### Administración (requiere rol `system_admin`)
- ✅ Gestión de usuarios (cambiar estado)
- ✅ Visualización de roles
- ✅ Visualización de ámbitos (scopes)
- ✅ Auditoría de operaciones
- ✅ Dashboard administrativo

### Estados de Cuenta
- ✅ Cuenta activa → Dashboard
- ✅ Cuenta suspendida → Página de aviso
- ✅ Cuenta inactiva → Página de aviso

## API y Autorización

La aplicación utiliza RPC públicas de Supabase para autorización:

```typescript
// Verificar permiso
const hasPermission = await supabase.rpc('can_do', {
  p_permission_name: 'users.view_all'
});

// Obtener roles del usuario
const roles = await supabase.rpc('get_my_roles');

// Obtener estado de cuenta
const status = await supabase.rpc('get_my_account_status');

// Asignar rol (admin)
await supabase.rpc('admin_assign_role', {
  p_target_user_id: userId,
  p_role_name: 'docente'
});
```

## Roles disponibles

- `estudiante` - Estudiante
- `docente` - Docente/Instructor
- `tutor` - Tutor de acompañamiento
- `investigador` - Investigador
- `coordinador` - Coordinador
- `system_admin` - Administrador técnico del sistema

## Permisos

- `users.create` - Crear usuarios (admin)
- `users.view_all` - Ver todos los usuarios
- `users.update_status` - Cambiar estado de usuario
- `roles.assign` - Asignar roles
- `roles.revoke` - Revocar roles
- `permissions.view` - Ver permisos
- `profile.view_own` - Ver perfil propio
- `profile.update_own` - Actualizar perfil propio
- `audit.view_all` - Ver auditoría global

## Desarrollo

### Scripts disponibles

```bash
npm run dev      # Iniciar servidor de desarrollo
npm run build    # Construir para producción
npm run start    # Iniciar servidor de producción
npm run lint     # Ejecutar linter
```

### Variables de entorno

Crea un archivo `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=<tu-url>
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<tu-clave-publishable>
NEXT_PUBLIC_SITE_URL=http://localhost:3000/academia
```

## Despliegue

### Vercel (recomendado)

1. Push tu código a GitHub
2. Conecta tu repositorio en Vercel
3. Configura las variables de entorno
4. Vercel automáticamente detectará que es un proyecto Next.js y lo desplegará

### Otros proveedores

Cualquier proveedor que soporte Next.js funcionará:
- Netlify
- Railway
- Render
- AWS Amplify

## Futuros módulos

Estos módulos están preparados visualmente pero aún no implementados:

- Formación (cursos, materias, evaluaciones)
- Docencia (clases, material didáctico)
- Tutoría (acompañamiento, expedientes)
- Investigación (proyectos, publicaciones)
- Coordinación (funciones administrativas)

## Problemas comunes

### "No puedo iniciar sesión"
- Verifica que la URL de Supabase sea correcta
- Verifica que la clave anon sea válida
- Revisa la consola del navegador para mensajes de error

### "No aparece mi perfil"
- Asegúrate de haber completado el registro
- Verifica que la tabla `user_profiles` tiene datos

### "No puedo acceder al admin"
- Verifica que tienes el rol `system_admin`
- Ejecuta la consulta SQL para asignar el rol

## Soporte

Para reportar bugs o sugerencias:
- Email: contacto@meriadock.org.mx
- GitHub Issues: [meriadock-academy/issues](https://github.com/kagenomusuko-svg/meriadock-academy/issues)

## Licencia

© Centro Multidisciplinario Meriadock. Formación y Asesoría A.C.
