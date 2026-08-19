'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Users,
  Lock,
  Database,
  FileText,
  ChevronRight,
} from 'lucide-react';

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  requiredPermission?: string;
}

const adminItems: SidebarItem[] = [
  {
    label: 'Panel de Admin',
    href: '/admin',
    icon: <BarChart3 size={20} />,
  },
  {
    label: 'Usuarios',
    href: '/admin/users',
    icon: <Users size={20} />,
  },
  {
    label: 'Roles',
    href: '/admin/roles',
    icon: <Lock size={20} />,
  },
  {
    label: 'Scopes',
    href: '/admin/scopes',
    icon: <Database size={20} />,
  },
  {
    label: 'Auditoría',
    href: '/admin/audit',
    icon: <FileText size={20} />,
  },
];

interface SidebarProps {
  isAdmin: boolean;
}

export function Sidebar({ isAdmin }: SidebarProps) {
  const pathname = usePathname();

  if (!isAdmin) return null;

  return (
    <aside className="hidden lg:block w-64 bg-gray-50 border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Administración
        </h3>
        <nav className="space-y-1">
          {adminItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? 'bg-institutional-dark text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                <span className="text-sm font-medium flex-1">
                  {item.label}
                </span>
                {isActive && <ChevronRight size={16} />}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
